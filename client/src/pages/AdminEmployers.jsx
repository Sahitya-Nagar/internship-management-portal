import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { Building, Mail, Calendar, User, Search, RefreshCw } from "lucide-react";

export default function AdminEmployers() {
  const { token } = useAuth();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/employers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setEmployers(response.data.data);
      }
    } catch (err) {
      console.error("Error loading employers:", err);
      setError(
        err.response?.data?.message || "Failed to load employers list."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const filteredEmployers = employers.filter(
    (emp) =>
      emp.employer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Employers & Placements
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            View organizations from placements records, locations, and total student counts
          </p>
        </div>
        <button
          onClick={fetchEmployers}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="mb-6 flex items-center bg-white px-3 py-2 border border-gray-200 rounded-md shadow-sm max-w-md">
        <Search size={16} className="text-gray-400 shrink-0 mr-2" />
        <input
          type="text"
          placeholder="Search by employer name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-gray-900 border-0 outline-none focus:ring-0 placeholder-gray-400"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-48 shadow-sm" />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      ) : filteredEmployers.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  <th className="pb-3">Employer Name</th>
                  <th className="pb-3">Location (City)</th>
                  <th className="pb-3 text-right">Students Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredEmployers.map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {emp.employer_name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="text-gray-600">{emp.city || "N/A"}</span>
                    </td>
                    <td className="py-3.5 text-right font-semibold text-gray-900">
                      {emp.placement_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Building className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No employers found</h3>
          <p className="text-gray-500 text-sm mt-1">
            There are no employer placement records matching the search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
