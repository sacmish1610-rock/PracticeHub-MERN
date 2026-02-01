import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    exam: "JEE",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await api.post("/api/auth/signup", form);
      setMsg(res.data.message || "Account created successfully ✅");

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Create Account
        </h1>
        <p className="text-slate-400 mb-8">
          Start your PracticeHub journey
        </p>

        {/* NAME */}
        <input
          className="w-full mb-4 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

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
          className="w-full mb-4 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        {/* EXAM */}
        <select
          name="exam"
          value={form.exam}
          onChange={handleChange}
          className="w-full mb-6 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="JEE">JEE (Active)</option>
          <option disabled>NEET (Coming Soon)</option>
          <option disabled>SSC (Coming Soon)</option>
          <option disabled>Banking (Coming Soon)</option>
          <option disabled>Railway (Coming Soon)</option>
        </select>

        {/* SIGNUP BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* MESSAGE */}
        {msg && (
          <p className="mt-4 text-sm text-green-400">
            {msg}
          </p>
        )}

        {/* LOGIN LINK */}
        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
