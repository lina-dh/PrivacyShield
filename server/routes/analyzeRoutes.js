import express from "express";
// ייבוא שתי הפונקציות מהקונטרולר
import { analyzeLink, reportAndTrain } from "../controllers/analyzeController.js";

const router = express.Router();

// נתיב לסריקה רגילה
router.post("/link-scanner/analyze", analyzeLink);

// נתיב לדיווח ואימון המודל מחדש
router.post("/link-scanner/report", reportAndTrain);

export default router;