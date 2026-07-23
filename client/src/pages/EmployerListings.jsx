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
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
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
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-200">
            Pending Review
          </span>
        );
      case "published":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-white text-gray-900 border border-gray-300">
            Published
          </span>
        );
      case "declined":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-white text-gray-500 border border-gray-200">
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const getApplicantStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-600 border border-gray-200">
            Submitted
          </span>
        );
      case "under_review":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 border border-gray-300">
            Under Review
          </span>
        );
      case "accepted":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-900 text-white border border-gray-900 flex items-center gap-1 w-max">
            <Check size={12} />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-md bg-white text-gray-500 border border-gray-200 flex items-center gap-1 w-max">
            <X size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const downloadResume = async (applicationId, studentName) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/applications/${applicationId}/resume`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentName.replace(/\s+/g, '_')}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading resume:", err);
      alert("Failed to download resume. Please try again.");
    }
  };

  if (selectedJob) {
    return (
      <div className="max-w-5xl mx-auto font-sans">
        <button
          onClick={() => setSelectedJob(null)}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </button>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
            Placements & Applicants for
          </span>
          <h2 className="text-xl font-bold text-gray-900">
            {selectedJob.title}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {selectedJob.city}, {selectedJob.province} &bull; {selectedJob.compensation} Position
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
            <Users className="text-gray-400" size={16} />
            Student Queue ({applicants.length})
          </h3>

          {loadingApplicants ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm font-medium">Loading applicants...</p>
            </div>
          ) : applicantError ? (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              {applicantError}
            </div>
          ) : applicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    <th className="pb-3">Student info</th>
                    <th className="pb-3">Major</th>
                    <th className="pb-3">Resume</th>
                    <th className="pb-3">Applied Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {applicants.map((app) => (
                    <tr key={app.id} className="text-gray-700 hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-900">{app.student_name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{app.student_email}</p>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-gray-600">
                        {app.student_major || "Kinesiology"}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => downloadResume(app.id, app.student_name)}
                          className="text-gray-900 hover:underline flex items-center gap-1 text-xs"
                        >
                          <FileText size={14} className="text-gray-500" />
                          <span>Download Resume</span>
                        </button>
                      </td>
                      <td className="py-3 text-xs text-gray-600">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {getApplicantStatusBadge(app.status)}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          {app.status === "submitted" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "under_review")}
                              className="px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs transition-colors flex items-center gap-1"
                            >
                              <Clock size={12} />
                              Review
                            </button>
                          )}
                          {app.status !== "accepted" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "accepted")}
                              className="px-2.5 py-1.5 rounded-md border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-xs transition-colors flex items-center gap-1"
                            >
                              <CheckCircle size={12} />
                              Accept
                            </button>
                          )}
                          {app.status !== "rejected" && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, "rejected")}
                              className="px-2.5 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs transition-colors flex items-center gap-1"
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
             <div className="text-center py-12 text-gray-500 text-sm">
              <p>No applications submitted for this listing yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          My Internship Listings
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage positions you have posted and process student applications
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-48 shadow-sm" />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      ) : jobs.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
            <ClipboardList className="text-gray-400" size={16} />
            Your Postings ({jobs.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  <th className="pb-3">Position Title</th>
                  <th className="pb-3">Discipline</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Applicants</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {jobs.map((job) => (
                  <tr key={job.id} className="text-gray-700 hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Submitted on {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-gray-600">{job.discipline}</td>
                    <td className="py-3 text-gray-500">{job.city}, {job.province}</td>
                    <td className="py-3">{getStatusBadge(job.status)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Users size={14} className="text-gray-400" />
                        <span>{job.applicant_count}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleJobSelect(job)}
                        className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium text-xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye size={12} className="text-gray-500" />
                        Applicants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto mt-12">
          <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900">No postings yet</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Click below to create and submit your first internship listing.
          </p>
          <a
            href="/employer/submit"
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Post a Job
          </a>
        </div>
      )}
    </div>
  );
}
