import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await api.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Login
        </h1>
        <p className="text-slate-400 mb-8">
          Welcome back to PracticeHub
        </p>

        {/* EMAIL */}
        <input
          className="w-full mb-4 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <input
          className="w-full mb-6 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ERROR */}
        {msg && (
          <p className="mt-4 text-sm text-red-400">
            {msg}
          </p>
        )}

        {/* SIGNUP */}
        <p className="mt-6 text-sm text-slate-400">
          New user?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}
