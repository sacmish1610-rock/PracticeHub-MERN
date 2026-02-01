import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">

        {/* BRAND */}
        <Link
          to="/dashboard"
          className="font-bold text-xl text-blue-400"
        >
          PracticeHub
        </Link>

        {/* NAV LINKS (ONLY IF LOGGED IN) */}
        {user && (
          <div className="flex gap-5 text-sm items-center">
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white transition"
            >
              Dashboard
            </Link>

            <Link
              to="/tracker"
              className="text-slate-300 hover:text-white transition"
            >
              Tracker
            </Link>

            <Link
              to="/analytics"
              className="text-slate-300 hover:text-white transition"
            >
              Analytics
            </Link>

            <Link
              to="/founder"
              className="text-slate-300 hover:text-white transition"
            >
              Founder
            </Link>

            {/* 🔥 ADMIN LINKS (ONLY FOR ADMIN) */}
            {user.role === "admin" && (
              <>
                <span className="h-4 w-px bg-slate-700 mx-1" />

                <Link
                  to="/admin/add-question"
                  className="text-yellow-400 hover:text-yellow-300 transition font-medium"
                >
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-4">

          {/* USER NAME */}
          {user && (
            <span className="text-sm text-slate-400 hidden sm:block">
              Hi,{" "}
              <span className="text-white font-medium">
                {user.name}
              </span>
              {user.role === "admin" && (
                <span className="ml-2 text-xs text-yellow-400">
                  (Admin)
                </span>
              )}
            </span>
          )}

          {/* AUTH BUTTON */}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              className="text-sm text-blue-400 hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
