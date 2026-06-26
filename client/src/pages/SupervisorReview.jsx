import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Eye,
  CheckCircle,
  XCircle,
  X,
  Building,
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
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Review Queue
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Review and moderate incoming internship positions submitted by employers
        </p>
      </div>

      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-900 text-white rounded-md flex items-center justify-center font-medium text-sm shadow-sm">
            {pendingJobs.length}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">Pending Submissions</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Positions waiting for approval.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline bg-white text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md border border-gray-200">
          Requires Action
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-48 shadow-sm" />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      ) : pendingJobs.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  <th className="pb-3">Organization</th>
                  <th className="pb-3">Position Info</th>
                  <th className="pb-3">Discipline</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Compensation</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {pendingJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">{job.organization}</td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {job.contact_name}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-gray-600">
                      {job.discipline}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {job.city}, {job.province}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-md text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700">
                        {job.compensation}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handlePublish(job.id)}
                          className="px-3 py-1.5 rounded-md text-white bg-gray-900 hover:bg-gray-800 font-medium text-xs transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle size={12} />
                          Publish
                        </button>
                        <button
                          onClick={() => handleDecline(job.id)}
                          className="px-3 py-1.5 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium text-xs transition-colors flex items-center gap-1"
                        >
                          <XCircle size={12} />
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
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto mt-12">
          <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900">Queue is clear</h3>
          <p className="text-gray-500 text-sm mt-1">
            There are no pending submissions to review.
          </p>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-200 flex justify-between items-start bg-gray-50">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  <Building size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm font-medium text-gray-600">
                    {selectedJob.organization}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Location</span>
                  <span className="font-medium text-gray-900">
                    {selectedJob.city}, {selectedJob.province}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Compensation</span>
                  <span className="font-medium text-gray-900">{selectedJob.compensation}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Discipline</span>
                  <span className="font-medium text-gray-900">{selectedJob.discipline}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Start Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(selectedJob.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Contact</span>
                  <span className="font-medium text-gray-900">{selectedJob.contact_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Email</span>
                  <span className="font-medium text-gray-900 break-all">{selectedJob.contact_email}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Phone</span>
                  <span className="font-medium text-gray-900">{selectedJob.contact_phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block font-medium">Apply Method</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {selectedJob.apply_method} ({selectedJob.apply_url})
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line p-4 rounded-md border border-gray-200 bg-gray-50">
                  {selectedJob.description}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDecline(selectedJob.id)}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors flex items-center gap-1.5"
                >
                  <XCircle size={14} />
                  Decline
                </button>
                <button
                  onClick={() => handlePublish(selectedJob.id)}
                  className="px-4 py-2 rounded-md text-white bg-gray-900 hover:bg-gray-800 font-medium text-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
