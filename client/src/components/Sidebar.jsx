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
  Users,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) return null;

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all border-l-4 mb-1 ${
      isActive(path)
        ? "bg-lancer-gold-50 text-lancer-blue-900 border-lancer-gold-500 font-bold"
        : "text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200"
    }`;

  return (
    <nav className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
      {/* UWindsor Branding Badge */}
      <div className="bg-lancer-blue-900 px-4 py-3 border-b-4 border-lancer-gold-500">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white rounded-sm flex items-center justify-center font-bold text-lancer-blue-900 text-xs">
            UW
          </div>
          <div className="text-white text-xs font-bold tracking-wide">
            CHPH Portal
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-lancer-gold-500 rounded-full flex items-center justify-center font-bold text-gray-900 text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 capitalize bg-white px-2 py-0.5 rounded-sm inline-block border border-gray-200">
              {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-2">
        {user.role === "student" && (
          <>
            <Link to="/jobs" className={linkClass("/jobs")}>
              <Briefcase size={18} />
              <span>Job Board</span>
            </Link>
            <Link to="/student/applications" className={linkClass("/student/applications")}>
              <FileText size={18} />
              <span>My Applications</span>
            </Link>
          </>
        )}

        {user.role === "employer" && (
          <>
            <Link to="/employer/listings" className={linkClass("/employer/listings")}>
              <ClipboardList size={18} />
              <span>My Listings</span>
            </Link>
            <Link to="/employer/submit" className={linkClass("/employer/submit")}>
              <PlusCircle size={18} />
              <span>Post a Position</span>
            </Link>
          </>
        )}

        {user.role === "supervisor" && (
          <>
            <Link to="/supervisor/review" className={linkClass("/supervisor/review")}>
              <ShieldCheck size={18} />
              <span>Review Queue</span>
            </Link>
            <Link to="/admin/employers" className={linkClass("/admin/employers")}>
              <Building2 size={18} />
              <span>Employers</span>
            </Link>
            <Link to="/admin/students" className={linkClass("/admin/students")}>
              <Users size={18} />
              <span>Students</span>
            </Link>
            <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
              <LayoutDashboard size={18} />
              <span>Analytics</span>
            </Link>
          </>
        )}

        {user.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/supervisor/review" className={linkClass("/supervisor/review")}>
              <ShieldCheck size={18} />
              <span>Reviews</span>
            </Link>
            <Link to="/admin/employers" className={linkClass("/admin/employers")}>
              <Building2 size={18} />
              <span>Employers</span>
            </Link>
            <Link to="/admin/students" className={linkClass("/admin/students")}>
              <Users size={18} />
              <span>Students</span>
            </Link>
            <Link to="/admin/placements" className={linkClass("/admin/placements")}>
              <ClipboardList size={18} />
              <span>Placements</span>
            </Link>
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-100 bg-gray-50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors border-l-4 border-transparent hover:border-red-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
