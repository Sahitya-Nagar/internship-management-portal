import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Layers,
  FileCheck,
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
  
  // Job Board States
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filter States
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [province, setProvince] = useState("");
  const [compensation, setCompensation] = useState("");

  // Application Modal States
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
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kinesiology Internship Board
        </h1>
        <p className="text-slate-500 mt-1">
          Explore active clinical, research, and educational placements at CHPH
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by role, company, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm font-medium"
            />
          </div>

          {/* Discipline dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm font-medium"
            >
              <option value="">All Disciplines</option>
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Province dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm font-medium"
            >
              <option value="">All Provinces</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Compensation dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white transition-all text-sm font-medium"
            >
              <option value="">Compensation</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(search || discipline || province || compensation) && (
            <button
              onClick={clearFilters}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-4"
            >
              <div className="h-6 w-2/3 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
              <div className="space-y-2 py-4">
                <div className="h-4 w-full bg-slate-200 rounded-md"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
              </div>
              <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Badges row */}
                <div className="flex gap-2 mb-4 items-center flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      job.compensation === "Paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {job.compensation}
                  </span>
                  {isNewJob(job.published_at) && (
                    <span className="bg-[#1a3a5c] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Sparkles size={12} />
                      New
                    </span>
                  )}
                  <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-full text-xs font-bold">
                    {job.discipline}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="text-xl font-bold text-slate-900 hover:text-[#1a3a5c] transition-colors leading-snug">
                  {job.title}
                </h3>

                {/* Organization */}
                <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm font-medium">
                  <Building size={16} className="text-slate-400 shrink-0" />
                  <span>{job.organization}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-500 mt-1.5 text-sm font-medium">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span>
                    {job.city}, {job.province}
                  </span>
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-2 text-slate-500 mt-1.5 text-sm font-medium">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <span>Starts: {new Date(job.start_date).toLocaleDateString()}</span>
                </div>

                {/* Description Truncated */}
                <p className="text-slate-600 text-sm mt-4 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 text-center py-2.5 rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setApplySuccess(false);
                    setApplyError("");
                    setResumeFile(null);
                  }}
                  className="flex-1 text-center py-2.5 rounded-xl text-white bg-[#1a3a5c] hover:bg-[#152e4a] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {job.apply_method === "link" ? (
                    <>
                      <ExternalLink size={14} />
                      Apply Now
                    </>
                  ) : (
                    <>
                      <Mail size={14} />
                      Email Contact
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto mt-12">
          <SlidersHorizontal className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No placements found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or discipline filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-[#1a3a5c] hover:text-[#152e4a] font-bold text-sm underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Details & Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-scale">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {selectedJob.discipline}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2 leading-snug">
                  {selectedJob.title}
                </h2>
                <p className="text-sm font-bold text-[#1a3a5c] mt-1">
                  {selectedJob.organization}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Job Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold tracking-wider">
                    Location
                  </span>
                  <span className="font-bold text-slate-700">
                    {selectedJob.city}, {selectedJob.province}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold tracking-wider">
                    Compensation
                  </span>
                  <span className="font-bold text-slate-700">
                    {selectedJob.compensation}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold tracking-wider">
                    Start Date
                  </span>
                  <span className="font-bold text-slate-700">
                    {new Date(selectedJob.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold tracking-wider">
                    Eligible Majors
                  </span>
                  <span className="font-bold text-slate-700">
                    {selectedJob.majors_eligible || "Kinesiology - All"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Position Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              {/* Application Section */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileCheck className="text-emerald-500 h-5 w-5" />
                  Submit Your Application
                </h3>

                {applySuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex flex-col gap-3 font-semibold text-sm justify-center items-center py-6 text-center animate-fade">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                    <div>
                      <p className="text-base font-extrabold text-emerald-900">
                        Application Submitted!
                      </p>
                      <p className="text-xs text-emerald-700 font-medium mt-1">
                        Your resume has been successfully uploaded to the CHPH database.
                      </p>
                      {selectedJob.apply_method === "link" && (
                        <div className="mt-4">
                          <p className="text-xs text-slate-500 font-bold mb-2">
                            This employer requires external registration:
                          </p>
                          <a
                            href={selectedJob.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[#1a3a5c] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#152e4a] transition-all"
                          >
                            <span>Complete Application on Employer Site</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                      {selectedJob.apply_method === "email" && (
                        <div className="mt-4 bg-white/50 p-3 rounded-xl border border-emerald-200/50">
                          <p className="text-xs text-slate-600 font-medium">
                            Please also email the contact professor directly at:{" "}
                            <span className="font-bold text-[#1a3a5c]">
                              {selectedJob.apply_url}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    {applyError && (
                      <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-medium">
                        {applyError}
                      </div>
                    )}

                    {/* File Dropzone */}
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
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-[#1a3a5c] rounded-2xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all"
                      >
                        {resumeFile ? (
                          <div className="flex items-center gap-3 text-slate-700">
                            <FileText size={32} className="text-[#1a3a5c]" />
                            <div className="text-left">
                              <p className="text-sm font-bold truncate max-w-xs">
                                {resumeFile.name}
                              </p>
                              <span className="text-xs text-slate-400 font-medium">
                                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="h-8 w-8 text-[#1a3a5c] mb-2" />
                            <p className="text-sm font-bold text-slate-700">
                              Upload your resume
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              PDF, DOC, or DOCX up to 10MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="px-5 py-2.5 rounded-xl text-white bg-[#1a3a5c] hover:bg-[#152e4a] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
                      >
                        {isApplying ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
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
