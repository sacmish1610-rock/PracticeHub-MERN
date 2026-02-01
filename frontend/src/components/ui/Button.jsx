export default function Button({
  children,
  type = "primary",
  onClick,
  className = "",
}) {
  const base =
    "px-4 py-2 rounded-lg transition font-medium text-sm";

  const styles = {
    primary: "bg-primary hover:bg-blue-700 text-white",
    secondary: "border border-slate-700 hover:bg-slate-800",
    danger: "bg-danger hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[type]} ${className}`}
    >
      {children}
    </button>
  );
}
