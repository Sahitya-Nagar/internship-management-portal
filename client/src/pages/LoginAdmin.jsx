import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { AlertCircle } from "lucide-react";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        const user = response.data.user;
        if (user.role !== "admin") {
          setError(
            `Access denied. This portal is for Administrators only. Your account is registered as: ${user.role}.`
          );
          setLoading(false);
          return;
        }
        login(response.data.token, user);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-8 pb-16">
      <div className="w-full max-w-md bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Administrator Login
          </h1>
          <p className="text-gray-500 text-sm mt-1">System Administrators</p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex gap-3 items-start bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uwindsor.ca"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lancer-blue-900 focus:border-transparent text-sm text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lancer-blue-900 focus:border-transparent text-sm text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-lancer-blue-900 hover:bg-lancer-blue-800 disabled:opacity-70 text-white text-sm font-bold rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lancer-blue-900 transition-colors"
            >
              {loading ? "Signing in..." : "Sign in as Administrator"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
