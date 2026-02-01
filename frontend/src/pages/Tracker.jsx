import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import api from "../api";
import Card from "../components/ui/Card";

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getLastNDays(n = 365) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - n + 1);
  return { start, end };
}

function calcCurrentStreak(valuesSet) {
  let streak = 0;
  const d = new Date();

  while (true) {
    const key = formatDate(d);
    if (valuesSet.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function calcMaxStreak(dates) {
  if (!dates.length) return 0;

  const sorted = [...dates].sort();
  let maxStreak = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);

    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      maxStreak = Math.max(maxStreak, current);
    } else {
      current = 1;
    }
  }

  return maxStreak;
}

export default function Tracker() {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/activity");
        setActivity(
          Array.isArray(res.data.activities) ? res.data.activities : []
        );
      } catch (err) {
        console.log(err);
        alert("Tracker load failed ❌");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 🔥 Correct mapping
  const values = useMemo(() => {
    return activity.map((item) => ({
      date: item.date,
      count: item.questionsSolved || 0,

    }));
  }, [activity]);

  const practicedSet = useMemo(
    () => new Set(values.filter(v => v.count > 0).map(v => v.date)),
    [values]
  );

  const totalSolved = useMemo(
    () => values.reduce((sum, v) => sum + v.count, 0),
    [values]
  );

  const activeDays = useMemo(
    () => values.filter(v => v.count > 0).length,
    [values]
  );

  const currentStreak = useMemo(
    () => calcCurrentStreak(practicedSet),
    [practicedSet]
  );

  const maxStreak = useMemo(
    () => calcMaxStreak(values.filter(v => v.count > 0).map(v => v.date)),
    [values]
  );

  const { start, end } = useMemo(() => getLastNDays(365), []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">Daily Tracker</h1>
          <p className="text-sm text-gray-400 mt-1">
            Database-based GitHub / LeetCode style activity tracker
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading tracker...</p>
        ) : (
          <>
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard title="Total Solved" value={totalSolved} />
              <StatCard title="Active Days" value={activeDays} />
              <StatCard title="Current Streak 🔥" value={currentStreak} />
              <StatCard title="Max Streak 🏆" value={maxStreak} />
            </div>

            {/* HEATMAP */}
            <Card className="overflow-x-auto">
              <CalendarHeatmap
                startDate={start}
                endDate={end}
                values={values}
                gutterSize={2}
                showWeekdayLabels
                classForValue={(value) => {
                  if (!value || value.count === 0) return "color-empty";
                  if (value.count >= 5) return "color-github-4";
                  if (value.count >= 3) return "color-github-3";
                  return "color-github-2";
                }}
                tooltipDataAttrs={(value) => {
                  if (!value || !value.date) {
                    return { "data-tip": "No practice" };
                  }
                  return {
                    "data-tip": `Solved ${value.count} questions on ${value.date}`,
                  };
                }}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <Card>
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </Card>
  );
}
