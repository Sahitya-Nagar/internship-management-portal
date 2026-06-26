import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  PlusCircle,
  ClipboardList,
  LogOut,
  Building2,
  ShieldCheck,
  User,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) return null;

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-gray-100 text-gray-900"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 flex flex-col justify-between z-20">
      <div>
        {/* Branding header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">
            CHPH Portal
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
            UWindsor Kinesiology
          </p>
        </div>

        {/* User profile */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Links based on role */}
        <nav className="px-3 py-4 space-y-1">
          {user.role === "student" && (
            <>
              <Link to="/jobs" className={linkClass("/jobs")}>
                <Briefcase size={16} className={isActive("/jobs") ? "text-gray-900" : "text-gray-400"} />
                <span>Job Board</span>
              </Link>
              <Link to="/student/applications" className={linkClass("/student/applications")}>
                <FileText size={16} className={isActive("/student/applications") ? "text-gray-900" : "text-gray-400"} />
                <span>Applications</span>
              </Link>
            </>
          )}

          {user.role === "employer" && (
            <>
              <Link to="/employer/listings" className={linkClass("/employer/listings")}>
                <ClipboardList size={16} className={isActive("/employer/listings") ? "text-gray-900" : "text-gray-400"} />
                <span>Listings</span>
              </Link>
              <Link to="/employer/submit" className={linkClass("/employer/submit")}>
                <PlusCircle size={16} className={isActive("/employer/submit") ? "text-gray-900" : "text-gray-400"} />
                <span>Post Job</span>
              </Link>
            </>
          )}

          {user.role === "supervisor" && (
            <>
              <Link to="/supervisor/review" className={linkClass("/supervisor/review")}>
                <ShieldCheck size={16} className={isActive("/supervisor/review") ? "text-gray-900" : "text-gray-400"} />
                <span>Reviews</span>
              </Link>
              <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                <LayoutDashboard size={16} className={isActive("/admin/dashboard") ? "text-gray-900" : "text-gray-400"} />
                <span>Analytics</span>
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                <LayoutDashboard size={16} className={isActive("/admin/dashboard") ? "text-gray-900" : "text-gray-400"} />
                <span>Analytics</span>
              </Link>
              <Link to="/supervisor/review" className={linkClass("/supervisor/review")}>
                <ShieldCheck size={16} className={isActive("/supervisor/review") ? "text-gray-900" : "text-gray-400"} />
                <span>Reviews</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut size={16} className="text-gray-400" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
