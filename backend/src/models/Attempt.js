import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    exam: { type: String, default: "JEE" },
    subject: { type: String, required: true },
    chapter: { type: String, required: true },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedIndex: { type: Number, required: true },
    correctIndex: { type: Number, required: true },

    isCorrect: { type: Boolean, default: false },

    timeTaken: { type: Number, default: 0 }, // seconds
  },
  { timestamps: true }
);

export default mongoose.model("Attempt", attemptSchema);
