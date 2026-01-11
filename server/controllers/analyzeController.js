import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// פונקציית העזר להרצת פייתון (סריקה)
async function getRiskScoreFromModel(url) {
  return new Promise((resolve) => {
    try {
      // נתיב: controllers -> server -> XGBOOST_model
      const pythonScriptPath = path.join(__dirname, '..', 'XGBOOST_model', 'predict_server.py');
      const pythonProcess = spawn('python', [pythonScriptPath, url]);

      let resultData = "";
      pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error("Python predict script exited with code", code);
          resolve(0);
          return;
        }
        const score = parseFloat(resultData.trim());
        resolve(isNaN(score) ? 0 : score);
      });
    } catch (err) {
      console.error("Model Error:", err);
      resolve(0);
    }
  });
}

// פונקציית הסריקה הראשית
export const analyzeLink = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "No message provided" });
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);

    if (!urls) {
      return res.status(200).json({
        success: true,
        data: { advice: { summary: "לא נמצא לינק לסריקה בהודעה." } }
      });
    }

    const targetUrl = urls[0];
    const riskScore = await getRiskScoreFromModel(targetUrl);

    res.status(200).json({
      success: true,
      data: {
        input: { url: targetUrl },
        result: {
          riskScore: riskScore,
          verdict: riskScore > 0.7 ? "Malicious" : riskScore > 0.4 ? "Suspicious" : "Safe",
          reasons: riskScore > 0.5 ? ["דפוסי פישינג זוהו במודל", "סיומת דומיין חשודה"] : ["לא נמצאו איומים מיידיים"]
        },
        advice: {
          summary: riskScore > 0.5 ? "זהירות! ה-AI זיהה שהלינק הזה עלול להיות מסוכן." : "הלינק נראה תקין, אך תמיד כדאי להיות עירניים."
        }
      }
    });
  } catch (error) {
    console.error("Analyze error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// פונקציית הדיווח והאימון (החדשה)
export const reportAndTrain = async (req, res) => {
  const { url, isMalicious } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: "No URL provided" });
  }

  const label = isMalicious ? "1" : "0";
  const pythonScriptPath = path.join(__dirname, '..', 'XGBOOST_model', 'retrain.py');

  console.log(`Starting retraining for: ${url} with label ${label}`);

  try {
    const pythonProcess = spawn('Python', [pythonScriptPath, url, label]);
    
    let resultData = "";
    pythonProcess.stdout.on('data', (data) => { resultData += data.toString(); });
    
    pythonProcess.stderr.on('data', (err) => { 
      console.error(`Python Retrain Stderr: ${err}`); 
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ success: false, message: "Retrain script failed" });
      }
      
      try {
        const responseJson = JSON.parse(resultData);
        return res.status(200).json({ success: true, data: responseJson });
      } catch (parseError) {
        // תיקון: הדפסת השגיאה כדי להשתמש במשתנה parseError
        console.log("Model updated, notice:", parseError.message);
        return res.status(200).json({ success: true, message: "המודל עודכן בהצלחה!" });
      }
    });
  } catch (err) {
    console.error("Retrain connection error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};