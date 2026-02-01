export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-card border border-slate-800 rounded-xl p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
