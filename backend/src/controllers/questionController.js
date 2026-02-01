import Question from "../models/Question.js";

/**
 * =================================================
 * GET QUESTIONS (Chapter-wise + Filter + Pagination)
 * =================================================
 * GET /api/questions
 * ?subject=physics
 * &chapter=Kinematics
 * &difficulty=easy
 * &page=1
 * &limit=10
 */
export const getQuestions = async (req, res) => {
  try {
    const { subject, chapter, difficulty, page = 1, limit = 10 } = req.query;

    if (!subject || !chapter) {
      return res
        .status(400)
        .json({ message: "subject and chapter required" });
    }

    const query = { subject, chapter };
    if (difficulty) query.difficulty = difficulty;

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .skip(skip)
        .limit(Number(limit)),
      Question.countDocuments(query),
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      questions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ======================================
 * GET RANDOM QUESTIONS (Practice Mode)
 * ======================================
 * GET /api/questions/random
 * ?subject=physics
 * &chapter=Kinematics
 * &difficulty=medium
 * &limit=10
 */
export const getRandomQuestions = async (req, res) => {
  try {
    const { subject, chapter, difficulty, limit = 10 } = req.query;

    if (!subject || !chapter) {
      return res
        .status(400)
        .json({ message: "subject and chapter required" });
    }

    const match = { subject, chapter };
    if (difficulty) match.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: Number(limit) } },
    ]);

    res.status(200).json({
      count: questions.length,
      questions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===========================
 * ADD QUESTION (ADMIN)
 * ===========================
 * POST /api/questions/add
 */
export const addQuestion = async (req, res) => {
  try {
    const {
      subject,
      chapter,
      difficulty,
      questionText,
      options,
      correctIndex,
    } = req.body;

    if (!subject || !chapter || !questionText || !options) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: "Options must be 4 ❌" });
    }

    if (correctIndex === undefined || correctIndex < 0 || correctIndex > 3) {
      return res
        .status(400)
        .json({ message: "Correct index must be 0-3 ❌" });
    }

    const q = await Question.create({
      subject,
      chapter,
      difficulty: difficulty || "easy",
      questionText,
      options,
      correctIndex,
    });

    res.status(201).json({
      message: "Question added ✅",
      question: q,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
