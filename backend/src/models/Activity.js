import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    questionsSolved: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT: ek user ka ek din me sirf ek record
activitySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Activity", activitySchema);
