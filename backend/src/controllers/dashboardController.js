import Attempt from "../models/Attempt.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // total solved attempts
    const totalSolved = await Attempt.countDocuments({ user: userId });

    // correct attempts
    const correctSolved = await Attempt.countDocuments({
      user: userId,
      isCorrect: true,
    });

    // wrong attempts
    const wrongSolved = await Attempt.countDocuments({
      user: userId,
      isCorrect: false,
    });

    // last activity date (latest attempt)
    const lastAttempt = await Attempt.findOne({ user: userId }).sort({
      createdAt: -1,
    });

    const lastActivityDate = lastAttempt ? lastAttempt.createdAt : null;

    // subject wise progress
    const subjectProgress = await Attempt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$subject",
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
          wrong: {
            $sum: { $cond: [{ $eq: ["$isCorrect", false] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      totalSolved,
      correctSolved,
      wrongSolved,
      lastActivityDate,
      subjectProgress,
    });
  } catch (error) {
    console.log("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
