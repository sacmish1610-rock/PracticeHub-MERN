import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-6 text-center text-sm">
      <p>
        Built with ❤️ by{" "}
        <Link
          to="/founder"
          className="text-white font-semibold hover:underline hover:text-indigo-400 transition"
        >
          Sachin Mishra
        </Link>
      </p>

      <p className="mt-1 text-slate-500">
        Founder & Developer · PracticeHub
      </p>
    </footer>
  );
}
