import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const navigate = useNavigate();

  const subjects = [
    {
      id: "physics",
      name: "Physics",
      desc: "Mechanics, Waves, Thermodynamics & more",
      emoji: "⚡",
      accent: "group-hover:text-blue-400",
      border: "hover:border-blue-500",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      desc: "Physical, Organic & Inorganic concepts",
      emoji: "🧪",
      accent: "group-hover:text-green-400",
      border: "hover:border-green-500",
    },
    {
      id: "maths",
      name: "Mathematics",
      desc: "Algebra, Calculus, Probability & more",
      emoji: "📐",
      accent: "group-hover:text-purple-400",
      border: "hover:border-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-4 sm:px-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            JEE Practice
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Select a subject to start practice
          </p>
        </div>

        {/* SUBJECT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/chapters/${s.id}`)}
              className="group text-left focus:outline-none"
            >
              <div
                className={`
                  h-full rounded-2xl border border-slate-800 bg-slate-900
                  p-5 sm:p-6
                  transition-all duration-300 ease-out
                  hover:scale-[1.04] hover:shadow-xl hover:shadow-black/40
                  ${s.border}
                `}
              >
                {/* Emoji */}
                <div
                  className={`
                    text-3xl sm:text-4xl mb-4
                    transition-transform duration-300
                    group-hover:scale-110
                  `}
                >
                  {s.emoji}
                </div>

                {/* Title */}
                <h2
                  className={`
                    text-lg sm:text-xl font-semibold mb-1
                    transition-colors duration-300
                    ${s.accent}
                  `}
                >
                  {s.name}
                </h2>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-5">
                  {s.desc}
                </p>

                {/* CTA */}
                <span
                  className="
                    inline-flex items-center gap-1
                    text-sm text-blue-400
                    transition-all duration-300
                    group-hover:gap-2 group-hover:underline
                  "
                >
                  View chapters →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
