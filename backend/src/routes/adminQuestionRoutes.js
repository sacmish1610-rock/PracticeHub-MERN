import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  getAllQuestionsAdmin,
  updateQuestionAdmin,
  deleteQuestionAdmin,
  bulkAddQuestionsAdmin,
} from "../controllers/adminQuestionController.js";

const router = express.Router();

/**
 * =========================================
 * ADMIN QUESTION ROUTES
 * Base path: /api/admin
 * =========================================
 */

// 🔹 Get all questions (with filters + pagination)
// GET /api/admin/questions
router.get("/questions", protect, adminOnly, getAllQuestionsAdmin);

// 🔹 Update a question
// PUT /api/admin/questions/:id
router.put("/questions/:id", protect, adminOnly, updateQuestionAdmin);

// 🔹 Delete a question
// DELETE /api/admin/questions/:id
router.delete("/questions/:id", protect, adminOnly, deleteQuestionAdmin);

// 🔹 Bulk upload questions (JSON)
// POST /api/admin/questions/bulk
router.post(
  "/questions/bulk",
  protect,
  adminOnly,
  bulkAddQuestionsAdmin
);

export default router;
