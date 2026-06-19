import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ShieldAlert,
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  X,
  Building,
  Info,
} from "lucide-react";

export default function SupervisorReview() {
  const { token } = useAuth();
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchPendingJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setPendingJobs(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching pending jobs:", err);
      setError("Failed to load pending reviews list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handlePublish = async (jobId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Remove from list immediately in UI
        setPendingJobs((prev) => prev.filter((job) => job.id !== jobId));
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("Error publishing job:", err);
      alert(err.response?.data?.message || "Failed to publish position.");
    }
  };

  const handleDecline = async (jobId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}/decline`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Remove from list immediately in UI
        setPendingJobs((prev) => prev.filter((job) => job.id !== jobId));
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("Error declining job:", err);
      alert(err.response?.data?.message || "Failed to decline position.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Supervisor Review Queue
        </h1>
        <p className="text-slate-500 mt-1">
          Review and moderate incoming internship positions submitted by employers
        </p>
      </div>

      {/* Notification Banner */}
      <div className="mb-8 p-5 bg-[#1a3a5c]/5 border border-[#1a3a5c]/10 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#1a3a5c] text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
            {pendingJobs.length}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Pending Submissions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Positions waiting for administrative publication approval.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline bg-amber-500/10 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/20">
          Requires Action
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse h-64 shadow-sm" />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      ) : pendingJobs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3">Organization</th>
                  <th className="pb-3">Position Info</th>
                  <th className="pb-3">Discipline</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Compensation</th>
                  <th className="pb-3">Submitted Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {pendingJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-900">{job.organization}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-800">{job.title}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">
                          By {job.contact_name} ({job.contact_email})
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {job.discipline}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">
                      {job.city}, {job.province}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          job.compensation === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                      >
                        {job.compensation}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-slate-400">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handlePublish(job.id)}
                          className="px-3.5 py-2 rounded-xl text-white bg-[#15693a] hover:bg-emerald-800 font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle size={14} />
                          Publish
                        </button>
                        <button
                          onClick={() => handleDecline(job.id)}
                          className="px-3.5 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <XCircle size={14} />
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto mt-12">
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Queue is clear!</h3>
          <p className="text-slate-500 text-sm mt-1">
            There are no pending internship submissions to review.
          </p>
        </div>
      )}

      {/* Review details modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-scale">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 bg-[#1a3a5c]/5 rounded-xl flex items-center justify-center text-[#1a3a5c]">
                  <Building size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#1a3a5c]">
                    {selectedJob.organization}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Placement Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Location</span>
                  <span className="font-bold text-slate-700">
                    {selectedJob.city}, {selectedJob.province}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Compensation</span>
                  <span className="font-bold text-slate-700">{selectedJob.compensation}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Discipline</span>
                  <span className="font-bold text-slate-700">{selectedJob.discipline}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Start Date</span>
                  <span className="font-bold text-slate-700">
                    {new Date(selectedJob.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Contact Name</span>
                  <span className="font-bold text-slate-700">{selectedJob.contact_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Contact Email</span>
                  <span className="font-bold text-[#1a3a5c] break-all">{selectedJob.contact_email}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Contact Phone</span>
                  <span className="font-bold text-slate-700">{selectedJob.contact_phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase font-bold">Apply Method</span>
                  <span className="font-bold text-slate-700 capitalize">
                    {selectedJob.apply_method} ({selectedJob.apply_url})
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {selectedJob.description}
                </p>
              </div>

              {/* Action area */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDecline(selectedJob.id)}
                  className="px-5 py-2.5 rounded-xl text-white bg-red-500 hover:bg-red-600 font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <XCircle size={14} />
                  Decline Job
                </button>
                <button
                  onClick={() => handlePublish(selectedJob.id)}
                  className="px-5 py-2.5 rounded-xl text-white bg-[#15693a] hover:bg-emerald-800 font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle size={14} />
                  Publish Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
