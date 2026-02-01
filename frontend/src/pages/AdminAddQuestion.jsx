import { useState } from "react";
import api from "../api";

export default function AdminAddQuestion() {
  const [form, setForm] = useState({
    subject: "physics",
    chapter: "Kinematics",
    difficulty: "easy",
    questionText: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  });

  const [loading, setLoading] = useState(false);

  const updateOption = (i, value) => {
    const newOptions = [...form.options];
    newOptions[i] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/api/questions/add", form);

      alert("✅ Question Added Successfully!");

      setForm({
        subject: "physics",
        chapter: "Kinematics",
        difficulty: "easy",
        questionText: "",
        options: ["", "", "", ""],
        correctIndex: 0,
      });
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "❌ Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-slate-400 mb-6">
          Add questions directly into MongoDB.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm">Subject</label>
            <select
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="maths">Maths</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 text-sm">Chapter</label>
            <input
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              value={form.chapter}
              onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Difficulty</label>
            <select
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 text-sm">Question</label>
            <textarea
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              rows={3}
              value={form.questionText}
              onChange={(e) =>
                setForm({ ...form, questionText: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Options (4)</label>
            <div className="grid gap-3 mt-2">
              {form.options.map((opt, i) => (
                <input
                  key={i}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  required
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm">Correct Option</label>
            <select
              className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              value={form.correctIndex}
              onChange={(e) =>
                setForm({ ...form, correctIndex: Number(e.target.value) })
              }
            >
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Question ✅"}
          </button>
        </form>
      </div>
    </div>
  );
}
