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
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            Submitted
          </span>
        );
      case "under_review":
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
            Under Review
          </span>
        );
      case "accepted":
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <CheckCircle2 size={12} />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-slate-500 mt-1">
          Track the status of your submitted internship applications
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse h-32"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-200 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {app.discipline}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {app.title}
                </h3>
                <p className="text-sm font-bold text-[#1a3a5c]">{app.organization}</p>
                
                {/* Meta details */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" />
                    {app.city}, {app.province}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText size={14} className="text-slate-400" />
                    Resume: {app.resume_path.split("/").pop().slice(7)} {/* Truncate prefix */}
                  </span>
                </div>
              </div>

              {/* Status and Action block */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-slate-50">
                {getStatusBadge(app.status)}
                
                {app.status === "accepted" && (
                  <div className="text-xs text-[#1a3a5c] font-bold bg-[#1a3a5c]/5 px-3 py-1.5 rounded-xl border border-[#1a3a5c]/10 flex items-center gap-1">
                    {app.apply_method === "link" ? (
                      <>
                        <ExternalLink size={12} />
                        <span>External Portal Active</span>
                      </>
                    ) : (
                      <>
                        <Mail size={12} />
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
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto mt-12">
          <ClipboardCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No applications yet</h3>
          <p className="text-slate-500 text-sm mt-1">
            Browse our job board to find and apply to placements.
          </p>
        </div>
      )}
    </div>
  );
}
