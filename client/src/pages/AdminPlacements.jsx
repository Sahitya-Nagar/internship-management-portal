import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { GraduationCap, Building, MapPin, Search, RefreshCw, Upload, X } from "lucide-react";

export default function AdminPlacements() {
  const { token } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedCompensation, setSelectedCompensation] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const formatSemester = (semesterStr) => {
    if (!semesterStr) return "";
    const parts = semesterStr.split(" ");
    if (parts.length === 2) {
      return `${parts[0].charAt(0).toUpperCase()}-${parts[1].slice(-2)}`;
    }
    return semesterStr;
  };

  const fetchPlacements = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/placements`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setPlacements(response.data.data);
      }
    } catch (err) {
      console.error("Error loading placements:", err);
      setError(
        err.response?.data?.message || "Failed to load placements list."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setError("");
    setUploadSuccess("");

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/placements/upload`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data.success) {
        const skipped = response.data.skippedCount > 0 ? ` (${response.data.skippedCount} rows skipped due to missing data)` : "";
        setUploadSuccess(`Successfully imported ${response.data.insertedCount} placements!${skipped}`);
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchPlacements();
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess("");
        }, 3000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  // Extract unique options for filter dropdowns dynamically
  const uniqueEmployers = [...new Set(placements.map(p => p.employer_name))].sort();
  const uniqueCities = [...new Set(placements.map(p => p.city))].sort();
  const uniqueDisciplines = [...new Set(placements.map(p => p.discipline))].sort();
  const uniqueSemesters = [...new Set(placements.map(p => (p.semester && p.academic_year) ? `${p.semester} ${p.academic_year}` : ""))]
    .filter(Boolean).sort((a, b) => b.localeCompare(a));

  const filteredPlacements = placements.filter((p) => {
    const matchesSearch =
      p.employer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.discipline?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesEmployer = selectedEmployer ? p.employer_name === selectedEmployer : true;
    const matchesCity = selectedCity ? p.city === selectedCity : true;
    const matchesDiscipline = selectedDiscipline ? p.discipline === selectedDiscipline : true;
    const matchesCompensation = selectedCompensation ? p.compensation?.toLowerCase() === selectedCompensation.toLowerCase() : true;
    const pSemesterStr = (p.semester && p.academic_year) ? `${p.semester} ${p.academic_year}` : "";
    const matchesSemester = selectedSemester ? pSemesterStr === selectedSemester : true;

    return matchesSearch && matchesEmployer && matchesCity && matchesDiscipline && matchesCompensation && matchesSemester;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEmployer("");
    setSelectedCity("");
    setSelectedDiscipline("");
    setSelectedCompensation("");
    setSelectedSemester("");
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-lancer-blue-900 tracking-tight">
            Student Placements
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            View all placed students, matching disciplines, locations, and compensation logs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-lancer-blue-900 rounded-md hover:bg-lancer-blue-800 transition-colors shadow-sm"
          >
            <Upload size={16} />
            <span>Import Data</span>
          </button>
          <button
            onClick={fetchPlacements}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center bg-gray-50 px-3 py-2 border border-gray-200 rounded-md shadow-sm">
            <Search size={16} className="text-gray-400 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search by student, employer, city, or discipline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 border-0 outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs">
              <span className="text-gray-500 font-medium">Term:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-transparent border-0 outline-none font-semibold text-gray-950 cursor-pointer focus:ring-0"
              >
                <option value="">All Terms</option>
                {uniqueSemesters.map((sem) => (
                  <option key={sem} value={sem}>{formatSemester(sem)}</option>
                ))}
              </select>
            </div>

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
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            {(searchTerm || selectedEmployer || selectedCity || selectedDiscipline || selectedCompensation || selectedSemester) && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-gray-900 hover:underline px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-48 shadow-sm" />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      ) : filteredPlacements.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  <th className="pb-3">Employer Name</th>
                  <th className="pb-3">Location (City)</th>
                  <th className="pb-3">Discipline</th>
                  <th className="pb-3">Term</th>
                  <th className="pb-3 text-right">Compensation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredPlacements.map((p, index) => (
                  <tr key={p.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{p.employer_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{p.city}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-gray-600">
                      {p.discipline}
                    </td>
                    <td className="py-3.5 text-xs text-gray-500">
                      {(p.semester && p.academic_year) ? formatSemester(`${p.semester} ${p.academic_year}`) : ""}
                    </td>
                    <td className="py-3.5 text-right font-semibold text-gray-900">
                      <span className={`px-2 py-1 rounded text-xs ${
                        p.compensation?.toLowerCase() === "paid"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {p.compensation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <GraduationCap className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No placements found</h3>
          <p className="text-gray-500 text-sm mt-1">
            There are no student placement records matching the search criteria.
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-lancer-blue-900">
              <h3 className="font-semibold text-white">Import Placement Data</h3>
              <button 
                onClick={() => { setShowUploadModal(false); setError(""); setUploadSuccess(""); }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
                  {error}
                </div>
              )}
              {uploadSuccess && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-100 font-medium">
                  {uploadSuccess}
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excel File (.xlsx)
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lancer-blue-50 file:text-lancer-blue-900 hover:file:bg-lancer-blue-100 cursor-pointer border border-gray-200 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-2">
                  File must contain headers: Year, Semester, Employer, Profession, City, Province, Payment, Major.
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-4 py-2 text-sm font-medium text-white bg-lancer-blue-900 rounded-md hover:bg-lancer-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload File"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
