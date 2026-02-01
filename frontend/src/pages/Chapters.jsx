import { useParams, useNavigate } from "react-router-dom";

const syllabus = {
  physics: [
    "Units & Dimensions",
    "Kinematics",
    "Laws of Motion",
    "Work, Power & Energy",
  ],
  chemistry: [
    "Atomic Structure",
    "Chemical Bonding",
    "Thermodynamics",
    "Equilibrium",
  ],
  maths: [
    "Quadratic Equations",
    "Sequences & Series",
    "Limits",
    "Probability",
  ],
};

export default function Chapters() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const chapters = syllabus[subjectId] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-4 sm:px-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {subjectId?.toUpperCase()} Chapters
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Select a chapter to start practice
          </p>
        </div>

        {/* CHAPTER GRID */}
        {chapters.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            No chapters available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {chapters.map((chapter) => (
              <div
                key={chapter}
                className="
                  w-full
                  rounded-2xl border border-slate-800 bg-slate-900 p-6
                  transition-all duration-300 ease-out
                  hover:border-blue-500 hover:bg-slate-900/80
                  hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30
                "
              >
                <p className="text-lg font-semibold mb-4">
                  {chapter}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/quiz/${subjectId}/${encodeURIComponent(chapter)}`
                    )
                  }
                  className="
                    w-full sm:w-auto
                    rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold
                    transition-all duration-300
                    hover:bg-blue-700 hover:scale-[1.05]
                    active:scale-95
                  "
                >
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        )}

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/subjects")}
          className="
            inline-flex items-center gap-2 text-sm text-slate-400
            transition-all duration-300
            hover:text-white hover:gap-3
          "
        >
          ← Back to Subjects
        </button>
      </div>
    </div>
  );
}
