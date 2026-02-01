import Activity from "../models/Activity.js";

/**
 * ===========================
 * ADD / UPDATE DAILY ACTIVITY
 * ===========================
 * POST /api/activity/add
 */
export const addActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { solved } = req.body;

    const today = new Date().toISOString().slice(0, 10);

    let activity = await Activity.findOne({
      user: userId,
      date: today,
    });

    if (activity) {
      activity.questionsSolved += solved;
      await activity.save();
    } else {
      activity = await Activity.create({
        user: userId,
        date: today,
        questionsSolved: solved,
      });
    }

    res.json({ message: "Activity updated ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===========================
 * GET ALL ACTIVITY (OLD)
 * ===========================
 * GET /api/activity
 */
export const getActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({ user: userId }).sort({ date: 1 });

    res.json({ activities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===========================
 * GET STREAK
 * ===========================
 * GET /api/activity/streak
 */
export const getStreak = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({ user: userId })
      .sort({ date: -1 })
      .limit(365);

    if (activities.length === 0) {
      return res.json({ streak: 0, lastActiveDate: null });
    }

    let streak = 0;
    let expectedDate = new Date().toISOString().slice(0, 10);

    for (const act of activities) {
      if (act.date === expectedDate) {
        streak++;
        expectedDate = new Date(
          new Date(expectedDate).setDate(
            new Date(expectedDate).getDate() - 1
          )
        )
          .toISOString()
          .slice(0, 10);
      } else {
        break;
      }
    }

    res.json({
      streak,
      lastActiveDate: activities[0].date,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===========================
 * GET MONTH ACTIVITY (CALENDAR)
 * ===========================
 * GET /api/activity/month?month=YYYY-MM
 */
export const getMonthActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // e.g. "2026-01"

    if (!month) {
      return res
        .status(400)
        .json({ message: "month is required (YYYY-MM)" });
    }

    const start = `${month}-01`;
    const endDate = new Date(`${month}-01`);
    endDate.setMonth(endDate.getMonth() + 1);
    const end = endDate.toISOString().slice(0, 10);

    const activities = await Activity.find({
      user: userId,
      date: { $gte: start, $lt: end },
    }).select("date questionsSolved");

    res.json({ activities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
