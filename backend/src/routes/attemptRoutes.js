import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveAttempts } from "../controllers/attemptController.js";

const router = express.Router();

// POST /api/attempts/save
router.post("/save", protect, saveAttempts);

export default router;
