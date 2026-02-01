import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    exam: { type: String, default: "JEE" },

    // ✅ NEW: ROLE field (Admin/User)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ✅ optional stats fields (for future, safe to keep)
    totalSolved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
