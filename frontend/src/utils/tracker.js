export function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getPracticeActivity() {
  const raw = localStorage.getItem("practice_activity");
  return raw ? JSON.parse(raw) : {};
}

export function savePracticeActivity(activity) {
  localStorage.setItem("practice_activity", JSON.stringify(activity));
}

export function addSolvedQuestionsToday(count = 1) {
  const today = formatDate(new Date());
  const activity = getPracticeActivity();
  activity[today] = (activity[today] || 0) + count;
  savePracticeActivity(activity);
}

export function calcCurrentStreak(activityObj) {
  const practicedDays = new Set(Object.keys(activityObj));
  let streak = 0;

  const d = new Date();
  while (true) {
    const key = formatDate(d);
    if (practicedDays.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

export function calcMaxStreak(activityObj) {
  const dates = Object.keys(activityObj).sort();
  if (dates.length === 0) return 0;

  let maxStreak = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);

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
