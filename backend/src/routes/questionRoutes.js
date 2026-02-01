import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  getQuestions,
  getRandomQuestions,
  addQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

/**
 * =========================
 * USER QUIZ ROUTES
 * =========================
 */

// Chapter-wise questions + difficulty + pagination
// GET /api/questions?subject=physics&chapter=Kinematics&difficulty=easy&page=1&limit=10
router.get("/", protect, getQuestions);

// Random practice questions (LeetCode style)
// GET /api/questions/random?subject=physics&chapter=Kinematics&difficulty=medium&limit=10
router.get("/random", protect, getRandomQuestions);

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// Add new question (admin only)
// POST /api/questions/add
router.post("/add", protect, adminOnly, addQuestion);

export default router;
