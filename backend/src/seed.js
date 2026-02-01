import dotenv from "dotenv";
import mongoose from "mongoose";
import Question from "./models/question.js";
import questions from "./data/questions.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Question.deleteMany();
    await Question.insertMany(questions);

    console.log("✅ Questions Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.log("❌ Seeding error:", err.message);
    process.exit(1);
  }
};

seed();
