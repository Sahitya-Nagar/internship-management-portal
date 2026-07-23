import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

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

    // Frontend password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-lancer-blue-50 to-lancer-gold-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-lancer-blue-700">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-lancer-blue-600 font-medium">
          UWindsor Kinesiology Internship Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg border border-lancer-blue-100 sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    role === "student"
                      ? "bg-lancer-blue-500 text-white border-transparent hover:bg-lancer-blue-600"
                      : "bg-white text-lancer-blue-700 border-lancer-blue-300 hover:bg-lancer-blue-50"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("employer")}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    role === "employer"
                      ? "bg-lancer-blue-500 text-white border-transparent hover:bg-lancer-blue-600"
                      : "bg-white text-lancer-blue-700 border-lancer-blue-300 hover:bg-lancer-blue-50"
                  }`}
                >
                  Employer
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Staff registration is handled by administrators.
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-lancer-blue-500 focus:outline-none focus:ring-lancer-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-lancer-blue-500 focus:outline-none focus:ring-lancer-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-lancer-blue-500 focus:outline-none focus:ring-lancer-blue-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {role === "student" && (
              <div>
                <label
                  htmlFor="major"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kinesiology Major
                </label>
                <div className="mt-1">
                  <select
                    id="major"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-lancer-blue-500 focus:outline-none focus:ring-lancer-blue-500 sm:text-sm"
                  >
                    {majors.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {role === "employer" && (
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium text-gray-700"
                >
                  Organization Name
                </label>
                <div className="mt-1">
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-lancer-blue-500 focus:outline-none focus:ring-lancer-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-lancer-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-lancer-blue-600 focus:outline-none focus:ring-2 focus:ring-lancer-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-lancer-blue-600 hover:text-lancer-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
