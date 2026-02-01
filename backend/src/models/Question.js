import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    exam: { type: String, default: "JEE" },

    subject: {
      type: String,
      enum: ["physics", "chemistry", "maths"],
      required: true,
    },

    chapter: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    questionText: { type: String, required: true },

    options: {
      type: [String],
      required: true,
      validate: [(arr) => arr.length === 4, "Options must be 4"],
    },

    correctIndex: { type: Number, required: true, min: 0, max: 3 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
