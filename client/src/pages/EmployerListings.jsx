import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ClipboardList,
  Users,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Briefcase,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export default function EmployerListings() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Applicant Drawer/Detail View State
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantError, setApplicantError] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to fetch your internship listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchApplicants = async (jobId) => {
    setLoadingApplicants(true);
    setApplicantError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/applications/job/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setApplicants(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setApplicantError("Failed to load applicants for this position.");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    fetchApplicants(job.id);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update local applicant state
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        // Refresh job list to update counts if needed
        fetchJobs();
      }
    } catch (err) {
      console.error("Error updating applicant status:", err);
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
            Pending Review
          </span>
        );
      case "published":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
            Published
          </span>
        );
      case "declined":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider">
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  const getApplicantStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            Submitted
          </span>
        );
      case "under_review":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            Under Review
          </span>
        );
      case "accepted":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 w-max">
            <Check size={12} />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-100 flex items-center gap-1 w-max">
            <X size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getResumeUrl = (path) => {
    // Return relative URL from the server upload location
    const filename = path.split("/").pop();
    return `${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/${filename}`;
  };

  if (selectedJob) {
    // Applicants details view
    return (
      <div className="max-w-5xl mx-auto font-sans animate-fade">
        <button
          onClick={() => setSelectedJob(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1a3a5c] font-bold text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1a3a5c]" />
          
          <span className="text-xs font-bold text-[#1a3a5c] uppercase tracking-wider block mb-1">
            Placements & Applicants for
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
            {selectedJob.title}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {selectedJob.city}, {selectedJob.province} • {selectedJob.compensation} Position
          </p>
        </div>

        {/* Applicants Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6">
          <h3 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <Users className="text-[#1a3a5c]" />
            Student Application Queue ({applicants.length})
          </h3>

          {loadingApplicants ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a3a5c] mx-auto"></div>
              <p className="text-slate-400 text-xs mt-3 font-semibold">Loading applicants...</p>
            </div>
          ) : applicantError ? (
            <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm font-semibold">
              {applicantError}
            </div>
          ) : applicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3">Student info</th>
                    <th className="pb-3">Major</th>
                    <th className="pb-3">Resume</th>
                    <th className="pb-3">Applied Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {applicants.map((app) => (
                    <tr key={app.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-bold text-slate-900">{app.student_name}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{app.student_email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-semibold text-slate-600">
                        {app.student_major || "Kinesiology"}
                      </td>
                      <td className="py-4">
                        <a
                          href={getResumeUrl(app.resume_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1a3a5c] hover:text-[#152e4a] flex items-center gap-1 font-bold text-xs hover:underline"
                        >
                          <FileText size={16} />
                          <span>View Resume</span>
                          <ExternalLink size={12} className="shrink-0" />
                        </a>
                      </td>
                      <td className="py-4 text-xs text-slate-500">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        {getApplicantStatusBadge(app.status)}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          {app.status === "submitted" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "under_review")}
                              className="px-2.5 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <Clock size={12} />
                              Review
                            </button>
                          )}
                          {app.status !== "accepted" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "accepted")}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold transition-all flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle size={12} />
                              Accept
                            </button>
                          )}
                          {app.status !== "rejected" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "rejected")}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold transition-all flex items-center gap-1 shadow-sm"
                            >
                              <XCircle size={12} />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
              <p className="text-slate-400 text-sm font-semibold">No applications submitted for this listing yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Listings summary view
  return (
    <div className="max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Internship Listings
        </h1>
        <p className="text-slate-500 mt-1">
          Manage positions you have posted and process student applications
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse h-64 shadow-sm" />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      ) : jobs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6">
          <h2 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <ClipboardList className="text-[#1a3a5c]" />
            Your Postings ({jobs.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Position Title</th>
                  <th className="pb-3">Discipline</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Applicants</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {jobs.map((job) => (
                  <tr key={job.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-900">{job.title}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          Submitted on {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-600">{job.discipline}</td>
                    <td className="py-4 text-slate-500">{job.city}, {job.province}</td>
                    <td className="py-4">{getStatusBadge(job.status)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Users size={16} className="text-slate-400" />
                        <span>{job.applicant_count}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleJobSelect(job)}
                        className="px-3.5 py-2 rounded-xl text-white bg-[#1a3a5c] hover:bg-[#152e4a] font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye size={14} />
                        View Applicants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto mt-12">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No postings yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Click below to create and submit your first internship listing.
          </p>
          <a
            href="/employer/submit"
            className="inline-flex items-center gap-1 bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#152e4a] transition-all shadow-md"
          >
            Post a Job
          </a>
        </div>
      )}
    </div>
  );
}
