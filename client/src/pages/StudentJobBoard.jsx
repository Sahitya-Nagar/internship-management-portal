import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Building,
  Sparkles,
  ExternalLink,
  Mail,
  FileText,
  UploadCloud,
  CheckCircle,
  X,
} from "lucide-react";

export default function StudentJobBoard() {
  const { token } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [province, setProvince] = useState("");
  const [compensation, setCompensation] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (discipline) params.discipline = discipline;
      if (province) params.province = province;
      if (compensation) params.compensation = compensation;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/published`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load internship listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, discipline, province, compensation]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setApplyError("Please select a resume file first.");
      return;
    }
    setApplyError("");
    setIsApplying(true);

    const formData = new FormData();
    formData.append("job_id", selectedJob.id);
    formData.append("resume", resumeFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setApplySuccess(true);
        setResumeFile(null);
      }
    } catch (err) {
      console.error("Error applying to job:", err);
      setApplyError(
        err.response?.data?.message || "Failed to submit your application. Please try again."
      );
    } finally {
      setIsApplying(false);
    }
  };

  const isNewJob = (publishedAt) => {
    if (!publishedAt) return false;
    const pubDate = new Date(publishedAt);
    const today = new Date();
    const diffTime = Math.abs(today - pubDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const clearFilters = () => {
    setSearch("");
    setDiscipline("");
    setProvince("");
    setCompensation("");
  };

  const disciplines = [
    "Physiotherapy",
    "Chiropractic",
    "Teaching",
    "General Kinesiology",
    "Other",
  ];

  const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Northwest Territories",
    "Nunavut",
    "Yukon",
  ];

  return (
    <div className="max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Job Board
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Explore active clinical, research, and educational placements
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by role, company, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors text-sm"
            />
          </div>

          <div className="w-full lg:w-48">
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors text-sm"
            >
              <option value="">All Disciplines</option>
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full lg:w-48">
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors text-sm"
            >
              <option value="">All Provinces</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full lg:w-48">
            <select
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors text-sm"
            >
              <option value="">Compensation</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {(search || discipline || province || compensation) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-lg p-5 border border-gray-200 animate-pulse space-y-4"
            >
              <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              <div className="space-y-2 py-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 shadow-sm transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-2 mb-3 items-center flex-wrap">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium border ${
                      job.compensation === "Paid"
                        ? "bg-gray-100 text-gray-800 border-gray-200"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {job.compensation}
                  </span>
                  {isNewJob(job.published_at) && (
                    <span className="bg-gray-900 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      <Sparkles size={10} />
                      New
                    </span>
                  )}
                  <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-md text-xs font-medium">
                    {job.discipline}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {job.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
                  <Building size={14} className="text-gray-400" />
                  <span>{job.organization}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                  <MapPin size={14} className="text-gray-400" />
                  <span>
                    {job.city}, {job.province}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                  <Calendar size={14} className="text-gray-400" />
                  <span>Starts {new Date(job.start_date).toLocaleDateString()}</span>
                </div>

                <p className="text-gray-600 text-sm mt-4 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 text-center py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setApplySuccess(false);
                    setApplyError("");
                    setResumeFile(null);
                  }}
                  className="flex-1 text-center py-2 rounded-md text-white bg-gray-900 hover:bg-gray-800 font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  {job.apply_method === "link" ? (
                    <>
                      <ExternalLink size={14} />
                      Apply
                    </>
                  ) : (
                    <>
                      <Mail size={14} />
                      Apply
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm max-w-xl mx-auto mt-12">
          <SlidersHorizontal className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No placements found</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-gray-900 hover:underline font-medium text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Details & Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-200 flex justify-between items-start bg-gray-50">
              <div>
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-600 border border-gray-200">
                  {selectedJob.discipline}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  {selectedJob.title}
                </h2>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  {selectedJob.organization}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200 text-sm">
                <div>
                  <span className="text-gray-500 text-xs block font-medium mb-1">
                    Location
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedJob.city}, {selectedJob.province}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium mb-1">
                    Compensation
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedJob.compensation}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium mb-1">
                    Start Date
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(selectedJob.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium mb-1">
                    Eligible Majors
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedJob.majors_eligible || "Kinesiology - All"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Position Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
                  <CheckCircle className="text-gray-400 h-4 w-4" />
                  Submit Application
                </h3>

                {applySuccess ? (
                  <div className="p-5 border border-gray-200 rounded-md text-center">
                    <CheckCircle className="h-8 w-8 text-gray-900 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Your resume was successfully uploaded.
                    </p>
                    
                    {selectedJob.apply_method === "link" && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">
                          Please complete the process on the employer website:
                        </p>
                        <a
                          href={selectedJob.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
                        >
                          Continue on Employer Site
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                    {selectedJob.apply_method === "email" && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 text-xs">
                        <p className="text-gray-600">
                          Also email the contact directly:{" "}
                          <span className="font-medium text-gray-900">{selectedJob.apply_url}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    {applyError && (
                      <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs">
                        {applyError}
                      </div>
                    )}

                    <div className="relative">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 hover:border-gray-900 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {resumeFile ? (
                          <div className="flex items-center gap-3 text-gray-900">
                            <FileText size={24} className="text-gray-500" />
                            <div className="text-left">
                              <p className="text-sm font-medium truncate max-w-xs">
                                {resumeFile.name}
                              </p>
                              <span className="text-xs text-gray-500">
                                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="h-6 w-6 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-900">
                              Upload your resume
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOC, or DOCX (Max 10MB)
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="px-4 py-2 rounded-md text-white bg-gray-900 hover:bg-gray-800 font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isApplying ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
