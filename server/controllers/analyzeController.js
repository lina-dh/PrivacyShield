// imports the OpenAI client so the backend can communicate with the OpenAI API
import OpenAI from "openai";
import {
  SAFETY_SYSTEM_PROMPT,
  LINK_SCANNER_JSON_SCHEMA_PROMPT,
} from "../utils/prompts/analyzerPrompts.js";

// --- helpers ---

function detectLanguage(text) {
  // Hebrew unicode range
  return /[\u0590-\u05FF]/.test(text) ? "he" : "en";
}

const isMockMode = () =>
  // checks if the OpenAI API key is missing or a placeholder
  // if yes -> returns a fake response
  !process.env.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY.includes("your_key_here");

// returns a mock JSON response for testing purposes
const MOCK_JSON = (url) => ({
  version: "1.0",
  tool: "link_scanner",
  input: { url },
  result: {
    verdict: "suspicious",
    confidence: 75,
    riskScore: 60,
    reasons: [
      "The link uses a shortener or hides its destination.",
      "It looks like it may lead to a login/verification page.",
    ],
    detectedSignals: {
      veryLongUrl: false,
      manySpecialChars: false,
      ipAddressInDomain: false,
      looksLikeBrandImpersonation: false,
      suspiciousTld: false,
      shortenedUrl: true,
    },
  },
  advice: {
    summary: "This link looks suspicious. Avoid clicking until you verify it.",
    twoQuickSteps: [
      "Do not click. Ask the sender what it is and verify via the official app/site.",
      "If you already clicked, change your password and turn on 2-factor authentication.",
    ],
  },
  debug: { assumptions: [], missingInfo: [] },
});

// schema-valid response when no URL exists in the message
const NO_URL_JSON = (lang) => ({
  version: "1.0",
  tool: "link_scanner",
  input: { url: null },
  result: {
    verdict: "safe",
    confidence: 100,
    riskScore: 0,
    reasons: [
      lang === "he"
        ? "לא נמצא קישור בהודעה."
        : "No link was found in the message.",
    ],
    detectedSignals: {
      veryLongUrl: false,
      manySpecialChars: false,
      ipAddressInDomain: false,
      looksLikeBrandImpersonation: false,
      suspiciousTld: false,
      shortenedUrl: false,
    },
  },
  advice: {
    summary:
      lang === "he"
        ? "לא נמצא קישור לסריקה בהודעה."
        : "No link detected to scan.",
    twoQuickSteps: [
      lang === "he"
        ? "אם תקבלי קישור, הדביקי אותו כאן או שלחי את ההודעה שוב."
        : "If you receive a link later, paste it here or resend the message.",
      lang === "he"
        ? "היזהרי מהודעות ממשתמשים לא מוכרים."
        : "Be cautious with messages from unknown senders.",
    ],
  },
  debug: { assumptions: [], missingInfo: [] },
});

function safeParseJson(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("No JSON found");
  return JSON.parse(text.slice(first, last + 1));
}

// memory control: keeps only the last 10 messages from the conversation
function trimConversation(conversation) {
  if (!Array.isArray(conversation)) return [];
  return conversation
    .filter(
      (m) =>
        m &&
        typeof m === "object" &&
        ["user", "assistant"].includes(m.role) &&
        typeof m.content === "string"
    )
    .slice(-10);
}

// extra safety: cap long message content (prevents huge payloads)
function capMessageLengths(messages, maxLen = 2000) {
  return messages.map((m) => ({
    ...m,
    content: m.content.length > maxLen ? m.content.slice(0, maxLen) : m.content,
  }));
}

// extract URLs from a message (supports multiple links)
function extractUrlsFromText(text) {
  if (typeof text !== "string") return [];
  // captures http(s) URLs until whitespace or quotes/brackets
  const urlRegex = /https?:\/\/[^\s"'<>]+/g;
  return text.match(urlRegex) || [];
}

// normalize & validate URL (soft validation)
function normalizeAndValidateUrl(inputUrl) {
  const raw = String(inputUrl ?? "").trim();

  if (!raw) {
    return { ok: false, status: 400, error: "No URL provided" };
  }

  const MAX_URL_LENGTH = 2048;
  if (raw.length > MAX_URL_LENGTH) {
    return {
      ok: false,
      status: 413,
      error: `URL is too long (max ${MAX_URL_LENGTH} characters).`,
    };
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname) throw new Error("Missing hostname");
    return { ok: true, url: withProtocol };
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Invalid URL format. Please paste a valid link.",
    };
  }
}

// validate incoming MESSAGE (not URL)
function normalizeAndValidateMessage(inputMessage) {
  const msg = String(inputMessage ?? "").trim();

  if (!msg) {
    return { ok: false, status: 400, error: "No message provided" };
  }

  // Prevent extremely long message payloads
  const MAX_MESSAGE_LENGTH = 5000;
  if (msg.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      status: 413,
      error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
    };
  }

  return { ok: true, message: msg };
}

// Link Scanner controller (now receives a MESSAGE that contains URL(s))
export const analyzeLink = async (req, res) => {
  try {
    const { message, conversation } = req.body;

    // Validate incoming message
    const msgCheck = normalizeAndValidateMessage(message);
    if (!msgCheck.ok) {
      return res.status(msgCheck.status).json({
        success: false,
        error: msgCheck.error,
      });
    }
    const normalizedMessage = msgCheck.message;

    // Extract URLs from the message
    const urls = extractUrlsFromText(normalizedMessage);

    // Detect language using conversation + message
    const history = trimConversation(conversation);
    const combinedUserText = [
      ...history.filter((m) => m.role === "user").map((m) => m.content),
      normalizedMessage,
    ].join(" ");

    const lang = detectLanguage(combinedUserText);

    // If no URL found, return schema-valid safe response (no crash)
    if (urls.length === 0) {
      return res.status(200).json({
        success: true,
        data: NO_URL_JSON(lang),
      });
    }

    // MVP: analyze the first URL
    const urlToAnalyze = urls[0];

    // Validate URL before sending to AI
    const urlCheck = normalizeAndValidateUrl(urlToAnalyze);
    if (!urlCheck.ok) {
      return res.status(urlCheck.status).json({
        success: false,
        error: urlCheck.error,
      });
    }
    const normalizedUrl = urlCheck.url;

    // Mock mode returns JSON in the SAME SHAPE
    if (isMockMode()) {
      return res.status(200).json({
        success: true,
        data: MOCK_JSON(normalizedUrl),
        isMock: true,
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let messages = [
      { role: "system", content: SAFETY_SYSTEM_PROMPT },
      { role: "system", content: LINK_SCANNER_JSON_SCHEMA_PROMPT },
      {
        role: "user",
        content: `Language preference: ${lang === "he" ? "Hebrew" : "English"}.
Return all TEXT VALUES in this language, but keep JSON keys in English exactly.`,
      },
      ...history,
      {
        role: "user",
        content:
          `The user pasted this message:\n` +
          normalizedMessage +
          `\n\nExtract the most relevant URL from it (already provided below) and analyze it.\nURL: ${normalizedUrl}\n\nReturn JSON only.`,
      },
    ];

    messages = capMessageLengths(messages, 2000);

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });

    const raw = response.choices?.[0]?.message?.content || "";
    let parsed;

    try {
      parsed = safeParseJson(raw);
    } catch {
      // repair attempt
      const repair = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: capMessageLengths(
          [
            { role: "system", content: SAFETY_SYSTEM_PROMPT },
            { role: "system", content: LINK_SCANNER_JSON_SCHEMA_PROMPT },
            {
              role: "user",
              content:
                "Fix this into VALID JSON matching the schema EXACTLY. Output JSON only:\n\n" +
                raw,
            },
          ],
          2000
        ),
        temperature: 0,
      });

      const repairedRaw = repair.choices?.[0]?.message?.content || "";
      parsed = safeParseJson(repairedRaw);
    }

    return res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "AI analysis failed.",
    });
  }
};
