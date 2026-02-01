import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { showError } from "../utils/toast";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [streak, setStreak] = useState(0);
  const [lastActive, setLastActive] = useState(null);

  // load dashboard stats
  const loadStats = async () => {
    try {
      const res = await api.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
      showError("Failed to load dashboard stats");
    } finally {
      setLoadingStats(false);
    }
  };

  // load streak
  const loadStreak = async () => {
    try {
      const res = await api.get("/api/activity/streak");
      setStreak(res.data.streak || 0);
      setLastActive(res.data.lastActiveDate || null);
    } catch (err) {
      console.log("Streak load failed", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([loadStats(), loadStreak()]);
    };
    loadAll();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-4 sm:px-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Welcome back! Here are your real-time stats.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/subjects")}
              className="
                w-full sm:w-auto
                rounded-xl bg-blue-600 px-5 py-3 font-semibold
                transition-all duration-300
                hover:bg-blue-700 hover:scale-[1.05]
                active:scale-95
              "
            >
              Start Practice
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="
                w-full sm:w-auto
                rounded-xl bg-slate-800 px-5 py-3
                transition-all duration-300
                hover:bg-slate-700 hover:scale-[1.05]
                active:scale-95
              "
            >
              Analytics
            </button>

            <button
              onClick={() => navigate("/calendar")}
              className="
                w-full sm:w-auto
                rounded-xl bg-slate-800 px-5 py-3
                transition-all duration-300
                hover:bg-slate-700 hover:scale-[1.05]
                active:scale-95
              "
            >
              Tracker
            </button>
          </div>
        </div>

        {/* FOUNDER BRANDING */}
        <div
          onClick={() => navigate("/founder")}
          className="
            cursor-pointer
            rounded-2xl border border-slate-800 bg-slate-900 p-5
            transition-all duration-300
            hover:border-indigo-500 hover:bg-slate-950
          "
        >
          <p className="text-sm text-slate-400">
            Built with ❤️ by
          </p>

          <p className="text-lg font-semibold text-white mt-1">
            Sachin Mishra
            <span className="text-slate-400 font-normal">
              {" "}· Founder & Developer
            </span>
          </p>

          <p className="mt-2 text-xs text-slate-500">
            “Consistency beats talent when talent doesn’t practice daily.”
          </p>
        </div>

        {/* CONTENT */}
        {loadingStats ? (
          /* SKELETON LOADER */
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-slate-800"
                />
              ))}
            </div>

            <div className="h-24 rounded-2xl bg-slate-800" />
            <div className="h-48 rounded-2xl bg-slate-800" />
          </div>
        ) : !stats ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            No stats found.
          </div>
        ) : (
          <>
            {/* TOP STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard title="Total Solved" value={stats.totalSolved} />
              <StatCard title="Correct" value={stats.correctSolved} />
              <StatCard title="Wrong" value={stats.wrongSolved} />
              <StatCard title="Streak" value={`${streak} days`} />
            </div>

            {/* LAST ACTIVITY */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-700">
              <h2 className="text-lg font-semibold mb-1">
                Last Activity
              </h2>
              <p className="text-slate-400 text-sm">
                {lastActive
                  ? new Date(lastActive).toLocaleDateString()
                  : "No activity yet."}
              </p>
            </div>

            {/* SUBJECT PROGRESS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold mb-4">
                Subject Wise Progress
              </h2>

              {stats.subjectProgress?.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  No subject progress yet.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {stats.subjectProgress.map((sub, idx) => {
                    const accuracy =
                      sub.total === 0
                        ? 0
                        : Math.round((sub.correct / sub.total) * 100);

                    return (
                      <div
                        key={idx}
                        className="
                          rounded-xl border border-slate-800 bg-slate-950 p-4
                          transition-all duration-300
                          hover:border-slate-700 hover:bg-slate-900
                        "
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">
                            {sub._id}
                          </p>
                          <p className="text-xs text-slate-400">
                            {accuracy}%
                          </p>
                        </div>

                        <p className="text-xs text-slate-400 mb-3">
                          Total: {sub.total} | ✅ {sub.correct} | ❌ {sub.wrong}
                        </p>

                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="
                              h-full bg-green-500
                              transition-all duration-700 ease-out
                            "
                            style={{ width: `${accuracy}%` }}
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
        rounded-2xl border border-slate-800 bg-slate-900 p-6
        transition-all duration-300 ease-out
        hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30
      "
    >
      <p className="text-xs text-slate-400 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
