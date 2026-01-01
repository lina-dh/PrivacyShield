// imports the OpenAI client so the backend can communicate with the OpenAI API
import OpenAI from "openai";
import {
  SAFETY_SYSTEM_PROMPT,
  LINK_SCANNER_JSON_SCHEMA_PROMPT,
} from "../utils/prompts.js";

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

// normalize & validate URL (soft validation)
// normalize the input because users may paste URLs without protocol - always assume the worst
function normalizeAndValidateUrl(inputUrl) {
  const raw = String(inputUrl ?? "").trim();

  if (!raw) {
    return { ok: false, status: 400, error: "No URL provided" };
  }

  // Limit to prevent very long inputs / token blowups
  const MAX_URL_LENGTH = 2048;
  if (raw.length > MAX_URL_LENGTH) {
    return {
      ok: false,
      status: 413,
      error: `URL is too long (max ${MAX_URL_LENGTH} characters).`,
    };
  }

  // Allow users to paste without protocol by auto-adding https://
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(withProtocol);
    // Basic check: must have hostname
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

// Link Scanner controller
export const analyzeLink = async (req, res) => {
  try {
    const { url, conversation } = req.body;

    // Validation: normalize + length limit + URL parsing
    const urlCheck = normalizeAndValidateUrl(url);
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

    // build messages with system prompts and trimmed conversation
    const history = trimConversation(conversation);

    const combinedUserText = history
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" ");

    const lang = detectLanguage(combinedUserText || normalizedUrl);

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
        content: `Scan this URL and return JSON only:\n${normalizedUrl}`,
      },
    ];

    // Validation: cap message lengths so weird huge content can't blow up
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
