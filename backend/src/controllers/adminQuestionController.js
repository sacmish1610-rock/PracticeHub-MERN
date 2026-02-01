import Question from "../models/Question.js";

/**
 * =========================================
 * GET ALL QUESTIONS (ADMIN)
 * =========================================
 * GET /api/admin/questions
 * ?subject=physics
 * &chapter=Kinematics
 * &difficulty=easy
 * &page=1
 * &limit=10
 */
export const getAllQuestionsAdmin = async (req, res) => {
  try {
    const {
      subject,
      chapter,
      difficulty,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (difficulty) query.difficulty = difficulty;

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort({ createdAt: -1 })
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
 * =========================================
 * UPDATE QUESTION (ADMIN)
 * =========================================
 * PUT /api/admin/questions/:id
 */
export const updateQuestionAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Question.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found ❌" });
    }

    res.json({
      message: "Question updated ✅",
      question: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================================
 * DELETE QUESTION (ADMIN)
 * =========================================
 * DELETE /api/admin/questions/:id
 */
export const deleteQuestionAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found ❌" });
    }

    res.json({ message: "Question deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================================
 * BULK ADD QUESTIONS (ADMIN) — EASY VERSION
 * =========================================
 * POST /api/admin/questions/bulk
 */
export const bulkAddQuestionsAdmin = async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        message: "Array of questions required ❌",
      });
    }

    const inserted = await Question.insertMany(questions);

    res.status(201).json({
      message: "Bulk upload successful ✅",
      insertedCount: inserted.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
