import Attempt from "../models/Attempt.js";
import Activity from "../models/Activity.js";

/**
 * ✅ Local-date safe function
 * Avoids UTC vs IST mismatch
 */
const todayDate = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};


export const saveAttempts = async (req, res) => {
  try {
    const { attempts } = req.body;

    // 1️⃣ VALIDATION
    if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
      return res.status(400).json({
        message: "Attempts array required ❌",
      });
    }

    // 2️⃣ ATTACH USER TO EACH ATTEMPT
    const formattedAttempts = attempts.map((a) => ({
      ...a,
      user: req.user._id,
    }));

    // 3️⃣ SAVE ALL ATTEMPTS (ARRAY SAFE)
    await Attempt.insertMany(formattedAttempts);

    // 4️⃣ UPDATE ACTIVITY (TRACKER / STREAK)
    const today = todayDate();

    await Activity.findOneAndUpdate(
      { user: req.user._id, date: today },
      {
        $inc: { questionsSolved: attempts.length },
         // total questions solved today
        $setOnInsert: {
          user: req.user._id,
          date: today,
        },
      },
      { upsert: true, new: true }
    );

    // 5️⃣ SUCCESS RESPONSE
    res.status(201).json({
      message: "Attempts + Activity saved ✅",
      count: formattedAttempts.length,
      date: today,
    });
  } catch (err) {
    console.error("SAVE ATTEMPTS ERROR:", err);
    res.status(500).json({
      message: "Failed to save attempts ❌",
    });
  }
};
