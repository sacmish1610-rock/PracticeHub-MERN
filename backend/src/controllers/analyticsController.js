import Attempt from "../models/Attempt.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalAttempts = await Attempt.countDocuments({ user: userId });
    const correctAttempts = await Attempt.countDocuments({
      user: userId,
      isCorrect: true,
    });

    const wrongAttempts = totalAttempts - correctAttempts;

    const accuracy =
      totalAttempts === 0
        ? 0
        : Math.round((correctAttempts / totalAttempts) * 100);

    // subject-wise solved
    const subjectStats = await Attempt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$subject",
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
    ]);

    res.json({
      totalAttempts,
      correctAttempts,
      wrongAttempts,
      accuracy,
      subjectStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
