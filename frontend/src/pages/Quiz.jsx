import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { showError, showSuccess } from "../utils/toast";
import Confetti from "react-confetti";

export default function Quiz() {
  const navigate = useNavigate();
  const { subjectId, chapterName } = useParams();
  const decodedChapter = decodeURIComponent(chapterName);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  const [attempts, setAttempts] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const [showConfetti, setShowConfetti] = useState(false);

  // LOAD QUESTIONS
  const loadQuestions = async (random = false) => {
    try {
      setLoading(true);

      const url = random
        ? `/api/questions/random?subject=${subjectId}&chapter=${decodedChapter}&difficulty=${difficulty}&limit=${limit}`
        : `/api/questions?subject=${subjectId}&chapter=${decodedChapter}&difficulty=${difficulty}&page=${page}&limit=${limit}`;

      const res = await api.get(url);
      const qs = res.data.questions || res.data || [];

      setQuestions(qs);
      setIndex(0);
      setSelected(null);
      setScore(0);
      setTimeLeft(90);
      setFinished(false);
      setAttempts([]);
      setQuestionStartTime(Date.now());
    } catch (err) {
      showError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(false);
    // eslint-disable-next-line
  }, [subjectId, decodedChapter, difficulty, page]);

  // RESET TIMER ON QUESTION CHANGE
  useEffect(() => {
    if (!questions.length || finished) return;
    setTimeLeft(90);
    setQuestionStartTime(Date.now());
  }, [index]);

  // TIMER
  useEffect(() => {
    if (finished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  useEffect(() => {
    if (timeLeft === 0 && !finished) {
      handleNext(true);
    }
    // eslint-disable-next-line
  }, [timeLeft]);

  // NEXT / SUBMIT
  const handleNext = async (auto = false) => {
    const current = questions[index];
    if (!current) return;

    let finalAttempts = attempts;

    if (!auto && selected !== null) {
      const timeTaken = Math.floor(
        (Date.now() - questionStartTime) / 1000
      );

      const attempt = {
        exam: "JEE",
        subject: subjectId,
        chapter: decodedChapter,
        questionId: current._id,
        selectedIndex: selected,
        correctIndex: current.correctIndex,
        isCorrect: selected === current.correctIndex,
        timeTaken,
      };

      finalAttempts = [...attempts, attempt];
      setAttempts(finalAttempts);

      if (selected === current.correctIndex) {
        setScore((p) => p + 1);
      }
    }

    if (index + 1 < questions.length) {
      setIndex((p) => p + 1);
      setSelected(null);
    } else {
      try {
        setSaving(true);
        await api.post("/api/attempts/save", { attempts: finalAttempts });
        showSuccess("Quiz submitted successfully ✅");

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      } catch (err) {
        showError("Failed to save attempts");
      } finally {
        setSaving(false);
        setFinished(true);
      }
    }
  };

  const current = useMemo(() => questions[index], [questions, index]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse w-full max-w-md space-y-4">
          <div className="h-6 bg-slate-800 rounded" />
          <div className="h-32 bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  // FINISHED — 🎉 CELEBRATION SCREEN
  if (finished) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4">
        {showConfetti && <Confetti recycle={false} />}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-scaleIn">
          <h1 className="text-3xl font-bold mb-3">
            🎉 Congratulations!
          </h1>

          <p className="text-lg mb-4">
            You scored <b>{score}</b> / {questions.length}
          </p>

          <p className="text-sm text-slate-400 italic mb-6">
            “Consistency beats talent when talent doesn’t practice.”
          </p>

          <p className="text-xs text-slate-500 mb-6">
            — Founder: Sachin Mishra
          </p>

          <Button
            className="w-full"
            onClick={() => navigate("/tracker")}
          >
            View Tracker
          </Button>
        </div>
      </div>
    );
  }

  // MAIN QUIZ UI
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">
              {subjectId.toUpperCase()} • {decodedChapter}
            </h1>
            <p className="text-sm text-gray-400">
              Question {index + 1} / {questions.length}
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-sm"
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <Button type="secondary" onClick={() => loadQuestions(true)}>
              Random
            </Button>
          </div>
        </div>

        <Card>
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>Time Left</span>
            <span className={timeLeft <= 15 ? "text-red-400 font-semibold" : ""}>
              {timeLeft}s
            </span>
          </div>

          <h2 className="text-base font-medium mb-5">
            {current.questionText}
          </h2>

          <div className="flex flex-col gap-3">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`text-left px-4 py-3 text-sm sm:text-base rounded-lg border transition-all
                  ${
                    selected === i
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-slate-700 hover:bg-slate-800"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Button
              onClick={() => handleNext(false)}
              disabled={saving}
              className="w-full"
            >
              {index + 1 === questions.length
                ? saving ? "Submitting..." : "Submit"
                : "Next Question"}
            </Button>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            type="secondary"
            className="w-full sm:w-auto"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <Button
            type="secondary"
            className="w-full sm:w-auto"
            onClick={() => setPage((p) => p + 1)}
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
}
