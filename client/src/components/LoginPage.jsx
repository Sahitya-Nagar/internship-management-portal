import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

const ROLE_CONFIG = {
  student: {
    label: "Student",
    description: "Students and Alumni",
    otherLogins: [
      { label: "Employer", path: "/login/employer" },
      { label: "Faculty / Staff", path: "/login/supervisor" },
      { label: "Admin", path: "/login/admin" },
    ],
  },
  employer: {
    label: "Employer",
    description: "Community Partners and Employers",
    otherLogins: [
      { label: "Student", path: "/login/student" },
      { label: "Faculty / Staff", path: "/login/supervisor" },
      { label: "Admin", path: "/login/admin" },
    ],
  },
  supervisor: {
    label: "Faculty & Staff",
    description: "Course Instructors and Supervisors",
    otherLogins: [
      { label: "Student", path: "/login/student" },
      { label: "Employer", path: "/login/employer" },
      { label: "Admin", path: "/login/admin" },
    ],
  },
  admin: {
    label: "Administrator",
    description: "System Administrators",
    otherLogins: [
      { label: "Student", path: "/login/student" },
      { label: "Employer", path: "/login/employer" },
      { label: "Faculty / Staff", path: "/login/supervisor" },
    ],
  },
};

export default function LoginPage({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const config = ROLE_CONFIG[role];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      if (response.data.success) {
        const user = response.data.user;
        const allowedRoles = role === "admin" ? ["admin"] : [role];
        if (!allowedRoles.includes(user.role)) {
          setError(`Access denied. This portal is for ${config.label}s only. Your account is registered as: ${user.role}.`);
          setLoading(false);
          return;
        }
        login(response.data.token, user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-8 pb-16">
      <div className="w-full max-w-md bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {config.label} Login
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {config.description}
          </p>
        </div>

        {/* Form Area */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex gap-3 items-start bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                UWindsor Email / Username
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@uwindsor.ca"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lancer-blue-900 focus:border-transparent text-sm text-gray-900 bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lancer-blue-900 focus:border-transparent text-sm text-gray-900 bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-lancer-blue-900 hover:bg-[#00267E] disabled:opacity-70 text-white text-sm font-bold rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lancer-blue-900 transition-colors"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          {role === "student" && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-lancer-blue-900 hover:underline">
                Register here
              </Link>
            </p>
          )}
        </div>


      </div>
    </div>
  );
}
