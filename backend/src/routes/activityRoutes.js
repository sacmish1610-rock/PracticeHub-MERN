import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addActivity,
  getActivity,
  getStreak,
  getMonthActivity,
} from "../controllers/activityController.js";

const router = express.Router();

/**
 * =========================
 * BASIC ACTIVITY ROUTES
 * =========================
 */

// Get all activities (old usage)
router.get("/", protect, getActivity);

// Manually add activity (old usage)
router.post("/add", protect, addActivity);

/**
 * =========================
 * STREAK ROUTE (Phase 9.2.3)
 * =========================
 */

router.get("/streak", protect, getStreak);

/**
 * =========================
 * TRACKER CALENDAR ROUTE
 * (Phase 9.2.5)
 * =========================
 * Example:
 * /api/activity/month?month=2026-01
 */

router.get("/month", protect, getMonthActivity);

export default router;
