import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { GraduationCap, Building, MapPin, Search, RefreshCw, Mail, Calendar, Briefcase } from "lucide-react";

export default function AdminStudents() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedCompensation, setSelectedCompensation] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error("Error loading students:", err);
      setError(
        err.response?.data?.message || "Failed to load students list."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Extract unique options for filter dropdowns dynamically
  const uniqueEmployers = [...new Set(students.map(s => s.employer_name))].filter(Boolean).sort();
  const uniqueCities = [...new Set(students.map(s => s.city))].filter(Boolean).sort();
  const uniqueMajors = [...new Set(students.map(s => s.major))].filter(Boolean).sort();
  const uniqueDisciplines = [...new Set(students.map(s => s.discipline))].filter(Boolean).sort();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.discipline?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesEmployer = selectedEmployer ? s.employer_name === selectedEmployer : true;
    const matchesCity = selectedCity ? s.city === selectedCity : true;
    const matchesMajor = selectedMajor ? s.major === selectedMajor : true;
    const matchesDiscipline = selectedDiscipline ? s.discipline === selectedDiscipline : true;
    const matchesCompensation = selectedCompensation ? s.compensation?.toLowerCase() === selectedCompensation.toLowerCase() : true;

    return matchesSearch && matchesEmployer && matchesCity && matchesMajor && matchesDiscipline && matchesCompensation;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEmployer("");
    setSelectedCity("");
    setSelectedMajor("");
    setSelectedDiscipline("");
    setSelectedCompensation("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Placed Students
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            View all students with placement records, their employers, majors, and placement details
          </p>
        </div>
        <button
          onClick={fetchStudents}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center bg-gray-50 px-3 py-2 border border-gray-200 rounded-md shadow-sm">
            <Search size={16} className="text-gray-400 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search by student name, email, employer, city, major, or discipline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 border-0 outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs">
            <span className="text-gray-500 font-medium">Employer:</span>
            <select
              value={selectedEmployer}
              onChange={(e) => setSelectedEmployer(e.target.value)}
              className="bg-transparent border-0 outline-none font-semibold text-gray-950 cursor-pointer focus:ring-0"
            >
              <option value="">All Employers</option>
              {uniqueEmployers.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs">
            <span className="text-gray-500 font-medium">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-0 outline-none font-semibold text-gray-955 cursor-pointer focus:ring-0"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs">
            <span className="text-gray-500 font-medium">Major:</span>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="bg-transparent border-0 outline-none font-semibold text-gray-955 cursor-pointer focus:ring-0"
            >
              <option value="">All Majors</option>
              {uniqueMajors.map((major) => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs">
            <span className="text-gray-500 font-medium">Discipline:</span>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-transparent border-0 outline-none font-semibold text-gray-955 cursor-pointer focus:ring-0"
            >
              <option value="">All Disciplines</option>
              {uniqueDisciplines.map((disc) => (
                <option key={disc} value={disc}>{disc}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs">
            <span className="text-gray-500 font-medium">Pay Status:</span>
            <select
              value={selectedCompensation}
              onChange={(e) => setSelectedCompensation(e.target.value)}
              className="bg-transparent border-0 outline-none font-semibold text-gray-955 cursor-pointer focus:ring-0"
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {(searchTerm || selectedEmployer || selectedCity || selectedMajor || selectedDiscipline || selectedCompensation) && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-gray-900 hover:underline px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-48 shadow-sm" />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider bg-gray-50">
                  <th className="pb-3 pt-4 px-6">Student</th>
                  <th className="pb-3 pt-4 px-4">Major</th>
                  <th className="pb-3 pt-4 px-4">Employer</th>
                  <th className="pb-3 pt-4 px-4">Location</th>
                  <th className="pb-3 pt-4 px-4">Discipline</th>
                  <th className="pb-3 pt-4 px-4">Term</th>
                  <th className="pb-3 pt-4 px-4">Placed Date</th>
                  <th className="pb-3 pt-4 px-4 text-right">Pay Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((s, index) => (
                  <tr key={s.placement_id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={16} className="text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {s.student_name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-6 text-xs text-gray-500">
                          <Mail size={12} className="text-gray-400" />
                          <span>{s.email || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-gray-700 font-medium">
                        {s.major || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {s.employer_name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-gray-700">
                          {s.city && s.province ? `${s.city}, ${s.province}` : s.city || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {s.discipline || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500">
                      {s.semester && s.academic_year ? `${s.semester} (${s.academic_year})` : "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={12} className="text-gray-400" />
                        <span>{formatDate(s.placed_at)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        s.compensation?.toLowerCase() === "paid"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {s.compensation || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filteredStudents.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{students.length}</span> placed students
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <GraduationCap className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No students found</h3>
          <p className="text-gray-500 text-sm mt-1">
            There are no placed students matching the search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
