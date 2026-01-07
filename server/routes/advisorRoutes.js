import express from 'express';
import { getAdvice } from '../controllers/advisorController.js';

const router = express.Router();

// הכתובת תהיה: POST /api/advisor/ask
router.post('/ask', getAdvice);

export default router;