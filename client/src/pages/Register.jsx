import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { GraduationCap, ShieldAlert, User, Mail, KeyRound, Building2 } from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [major, setMajor] = useState("Kinesiology - Movement Science");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      email,
      password,
      role,
      organization: role === "employer" ? organization : undefined,
      major: role === "student" ? major : undefined,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        payload
      );

      if (response.data.success) {
        login(response.data.token, response.data.user);
      }
    } catch (err) {
      console.error("Register failure:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred during registration. Please check your fields."
      );
    } finally {
      setLoading(false);
    }
  };

  const majors = [
    "Kinesiology - Movement Science",
    "Kinesiology - Sport Management",
    "Kinesiology - Education",
    "Kinesiology - General",
    "Kinesiology - Other",
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
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Join the CHPH Internship Portal
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 text-red-700 text-sm font-medium items-start animate-shake">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Role selector buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              I want to register as a
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                  role === "student"
                    ? "bg-[#1a3a5c] text-white border-transparent shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                  role === "employer"
                    ? "bg-[#1a3a5c] text-white border-transparent shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Employer
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              Note: Supervisor and Admin registrations must be completed by system administrators.
            </p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "student" ? "student@uwindsor.ca" : "employer@company.com"
                  }
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Conditional Field: Student Major */}
            {role === "student" && (
              <div>
                <label
                  htmlFor="major"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Kinesiology Major
                </label>
                <select
                  id="major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm"
                >
                  {majors.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Conditional Field: Employer Organization */}
            {role === "employer" && (
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Organization Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Building2 size={18} />
                  </div>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Windsor Cardiac Rehabilitation"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
            )}
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
                "Register"
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1a3a5c] hover:text-[#152e4a] font-bold hover:underline underline-offset-4"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
