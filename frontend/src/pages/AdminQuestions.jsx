import { useEffect, useState } from "react";
import api from "../api";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // edit modal state
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit });
      if (subject) params.append("subject", subject);
      if (difficulty) params.append("difficulty", difficulty);

      const res = await api.get(`/api/admin/questions?${params.toString()}`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load questions ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line
  }, [page, subject, difficulty]);

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/api/admin/questions/${id}`);
      loadQuestions();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  // ======================
  // EDIT SAVE
  // ======================
  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await api.put(`/api/admin/questions/${editing._id}`, editing);
      setEditing(null);
      loadQuestions();
    } catch (err) {
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin • Questions</h1>

        {/* FILTERS */}
        <div className="flex gap-3 mb-6">
          <select
            value={subject}
            onChange={(e) => {
              setPage(1);
              setSubject(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg"
          >
            <option value="">All Subjects</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="maths">Maths</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => {
              setPage(1);
              setDifficulty(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg"
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Chapter</th>
                  <th className="p-3 text-left">Difficulty</th>
                  <th className="p-3 text-left">Question</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr
                    key={q._id}
                    className="border-t border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="p-3 capitalize">{q.subject}</td>
                    <td className="p-3">{q.chapter}</td>
                    <td className="p-3 capitalize">{q.difficulty}</td>
                    <td className="p-3 truncate max-w-xs">
                      {q.questionText}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEditing(q)}
                        className="text-blue-400 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-slate-800 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-slate-400">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-slate-800 px-4 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>

      {/* ======================
          EDIT MODAL
          ====================== */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Question</h2>

            <input
              value={editing.chapter}
              onChange={(e) =>
                setEditing({ ...editing, chapter: e.target.value })
              }
              className="w-full mb-3 bg-slate-950 border border-slate-800 p-2 rounded"
              placeholder="Chapter"
            />

            <textarea
              value={editing.questionText}
              onChange={(e) =>
                setEditing({ ...editing, questionText: e.target.value })
              }
              className="w-full mb-3 bg-slate-950 border border-slate-800 p-2 rounded"
              rows={3}
            />

            {editing.options.map((opt, i) => (
              <input
                key={i}
                value={opt}
                onChange={(e) => {
                  const opts = [...editing.options];
                  opts[i] = e.target.value;
                  setEditing({ ...editing, options: opts });
                }}
                className="w-full mb-2 bg-slate-950 border border-slate-800 p-2 rounded"
              />
            ))}

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="bg-green-600 px-4 py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setEditing(null)}
                className="bg-slate-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
