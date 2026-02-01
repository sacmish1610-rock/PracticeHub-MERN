import Activity from "../models/Activity.js";

const formatDate = (date = new Date()) => date.toISOString().slice(0, 10);

const calcCurrentStreak = (activityMap) => {
  let streak = 0;
  const d = new Date();

  while (true) {
    const key = formatDate(d);
    if (activityMap[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
};

const calcMaxStreak = (dates) => {
  if (!dates.length) return 0;

  const sorted = [...dates].sort();
  let maxStreak = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);

    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      maxStreak = Math.max(maxStreak, current);
    } else {
      current = 1;
    }
  }

  return maxStreak;
};

export const getStats = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id });

    let totalSolved = 0;
    const activityMap = {};
    const dates = [];

    for (const a of activities) {
      totalSolved += a.solved;
      activityMap[a.date] = a.solved;
      dates.push(a.date);
    }

    const stats = {
      totalSolved,
      activeDays: activities.length,
      currentStreak: calcCurrentStreak(activityMap),
      maxStreak: calcMaxStreak(dates),
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
