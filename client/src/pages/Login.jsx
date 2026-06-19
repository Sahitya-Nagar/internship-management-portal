import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { GraduationCap, ShieldAlert, KeyRound, Mail } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Double check if the logged in user actually has the selected role (or is admin/supervisor bypassing standard restrictions)
        const user = response.data.user;
        
        if (user.role !== role && user.role !== "admin") {
          // If supervisor tries to log in under supervisor tab, role must match
          setError(`Incorrect role selected. This account is registered as a ${user.role}.`);
          setLoading(false);
          return;
        }

        login(response.data.token, user);
      }
    } catch (err) {
      console.error("Login failure:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "student", label: "Student" },
    { id: "employer", label: "Employer" },
    { id: "supervisor", label: "Supervisor" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
        {/* Decorative branding stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#1a3a5c]" />

        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#1a3a5c]/5 rounded-2xl flex items-center justify-center text-[#1a3a5c] shadow-sm mb-4">
            <GraduationCap className="h-10 w-10 text-[#1a3a5c]" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            CHPH Internship Portal
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Centre for Human Performance and Health
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Sign in as
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === r.id
                    ? "bg-[#1a3a5c] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 text-red-700 text-sm font-medium items-start animate-shake">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "student" ? "student@uwindsor.ca" : "name@example.com"
                  }
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#1a3a5c] hover:bg-[#152e4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3a5c] transition-all shadow-md disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#1a3a5c] hover:text-[#152e4a] font-bold hover:underline underline-offset-4"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
