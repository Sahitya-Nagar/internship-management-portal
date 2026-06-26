import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { ClipboardCheck, MapPin, Calendar, ExternalLink, Mail, FileText, CheckCircle2 } from "lucide-react";

export default function StudentApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/applications/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load your applications list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 border border-gray-200">
            Submitted
          </span>
        );
      case "under_review":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 border border-gray-200">
            Under Review
          </span>
        );
      case "accepted":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-900 text-white border border-gray-900 flex items-center gap-1 shrink-0">
            <CheckCircle2 size={12} />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-white text-gray-600 border border-gray-300">
            Rejected
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

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Track the status of your submitted internship applications
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-lg p-5 border border-gray-200 animate-pulse h-28"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-300 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {app.discipline}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  {app.title}
                </h3>
                <p className="text-sm font-medium text-gray-600">{app.organization}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 pt-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" />
                    {app.city}, {app.province}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400" />
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText size={12} className="text-gray-400" />
                    Resume: {app.resume_path.split("/").pop().slice(7)}
                  </span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-gray-100">
                {getStatusBadge(app.status)}
                
                {app.status === "accepted" && (
                  <div className="text-xs text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5">
                    {app.apply_method === "link" ? (
                      <>
                        <ExternalLink size={12} className="text-gray-500" />
                        <span>External Portal</span>
                      </>
                    ) : (
                      <>
                        <Mail size={12} className="text-gray-500" />
                        <span>Contact Initiated</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto mt-12">
          <ClipboardCheck className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-500 text-sm mt-1">
            Browse our job board to find and apply to placements.
          </p>
        </div>
      )}
    </div>
  );
}
