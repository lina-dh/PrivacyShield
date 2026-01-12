import 'dotenv/config';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { getSystemPrompt, getUserPrompt } from '../utils/prompts/analyzerPrompts.js';

// הגדרת __dirname ל־ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// אתחול OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * פונקציית עזר: הרצת מודל XGBoost (Python)
 * מחזירה מספר בין 0 ל־1
 */
async function getRiskScoreFromModel(url) {
  return new Promise((resolve) => {
    const pythonScriptPath = path.join(
      __dirname,
      '..',
      'XGBOOST_model',
      'predict_server.py'
    );

    const pythonProcess = spawn('python', [pythonScriptPath, url]);

    let resultData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (errorData) {
        console.log('[Python logs]:\n', errorData);
      }

      if (code !== 0) {
        console.error('Python script failed');
        return resolve(0);
      }

      const score = parseFloat(resultData.trim());
      resolve(Number.isNaN(score) ? 0 : score);
    });
  });
}

/**
 * ניתוח לינק: XGBoost + LLM
 */
export const analyzeLink = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'No message provided',
      });
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);

    if (!urls) {
      return res.status(200).json({
        success: true,
        data: {
          advice: {
            summary: 'לא זיהיתי לינק בהודעה. נסי להדביק כתובת מלאה.',
          },
          result: {
            verdict: 'safe',
            reasons: [],
          },
        },
      });
    }

    const targetUrl = urls[0];

    // --- שלב 1: XGBoost ---
    const riskScore = await getRiskScoreFromModel(targetUrl);
   

    // --- שלב 2: OpenAI Responses API ---
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: getSystemPrompt(),
        },
        {
          role: 'user',
          content: getUserPrompt(targetUrl, riskScore),
        },
      ],
    });

    let outputText = response.output_text;

// ניקוי עטיפת Markdown אם קיימת
outputText = outputText
  .replace(/```json\s*/i, '') // מסיר ```json אם יש
  .replace(/```/g, '')        // מסיר ``` סגירה
  .trim();                     // מסיר רווחים מיותרים

let aiAnalysis;
try {
  aiAnalysis = JSON.parse(outputText);
} catch  {
  console.error('AI returned invalid JSON');
  console.error('Raw output:', outputText);
  throw new Error('AI response parsing failed');
}

    // --- שלב 3: החזרת תשובה לקליינט ---
    return res.status(200).json({
      success: true,
      data: {
        input: { url: targetUrl },
        result: {
          riskScore: riskScore,
          verdict: aiAnalysis.verdict,
          reasons: aiAnalysis.reasons,
        },
        advice: {
          summary: aiAnalysis.summary,
          twoQuickSteps: aiAnalysis.twoQuickSteps,
        },
      },
    });
  } catch (error) {
    console.error('Analyze Critical Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'שגיאה בניתוח ההודעה. נסי שוב בעוד רגע.',
    });
  }
};

/**
 * דיווח ואימון מחדש
 */
export const reportAndTrain = async (req, res) => {
  const { url, isMalicious } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'No URL provided',
    });
  }

  const pythonScriptPath = path.join(
    __dirname,
    '..',
    'XGBOOST_model',
    'retrain.py'
  );

  const label = isMalicious ? '1' : '0';

  try {
    const pythonProcess = spawn('python', [
      pythonScriptPath,
      url,
      label,
    ]);

    let resultData = '';
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.on('close', () => {
      try {
        const jsonRes = JSON.parse(resultData);
        return res.status(200).json({ success: true, data: jsonRes });
      } catch {
        return res.status(200).json({
          success: true,
          message: 'הדיווח התקבל והמודל עודכן',
        });
      }
    });
  } catch (err) {
    console.error('Retrain error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during retrain',
    });
  }
};
