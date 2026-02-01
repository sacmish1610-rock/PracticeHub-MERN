import { useEffect, useState } from "react";
import api from "../api";
import { showError } from "../utils/toast";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/analytics");
        setData(res.data);
      } catch (err) {
        console.log(err);
        showError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Analytics 📊
        </h1>
        <p className="text-slate-400 mb-8 text-sm sm:text-base">
          Real-time performance based on your attempts.
        </p>

        {/* LOADING STATE */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-slate-800"
                />
              ))}
            </div>

            <div className="h-32 rounded-2xl bg-slate-800" />
            <div className="h-56 rounded-2xl bg-slate-800" />
          </div>
        ) : !data ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400">
            No analytics found.
          </div>
        ) : (
          <>
            {/* TOP STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Attempts" value={data.totalAttempts} />
              <StatCard title="Correct ✅" value={data.correctAttempts} />
              <StatCard title="Wrong ❌" value={data.wrongAttempts} />
              <StatCard title="Accuracy 🎯" value={`${data.accuracy}%`} />
            </div>

            {/* ACCURACY METER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Accuracy Meter
              </h2>

              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-700 ease-out"
                  style={{ width: `${data.accuracy}%` }}
                />
              </div>

              <p className="text-slate-400 mt-3 text-sm">
                You are {data.accuracy}% accurate overall.
              </p>
            </div>

            {/* SUBJECT WISE PERFORMANCE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Subject Wise Performance
              </h2>

              {data.subjectStats?.length === 0 ? (
                <p className="text-slate-400">
                  No subject data yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {data.subjectStats.map((s, idx) => {
                    const acc =
                      s.total === 0
                        ? 0
                        : Math.round((s.correct / s.total) * 100);

                    return (
                      <div
                        key={idx}
                        className="
                          bg-slate-950 rounded-xl p-4 border border-slate-800
                          transition-all duration-300
                          hover:border-slate-700 hover:bg-slate-900
                        "
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">
                            {s._id}
                          </p>
                          <p className="text-sm text-slate-400">
                            {s.correct}/{s.total} correct • {acc}%
                          </p>
                        </div>

                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-700 ease-out"
                            style={{ width: `${acc}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      className="
        bg-slate-900 border border-slate-800 rounded-2xl p-5
        transition-all duration-300
        hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30
      "
    >
      <p className="text-slate-400 text-sm">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
