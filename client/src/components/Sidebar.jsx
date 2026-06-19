import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  PlusCircle,
  ClipboardList,
  LogOut,
  GraduationCap,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) return null;

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive(path)
        ? "bg-white/10 text-white shadow-md border-l-4 border-emerald-500"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="w-64 bg-[#1a3a5c] text-white h-screen fixed top-0 left-0 flex flex-col justify-between shadow-2xl z-20 border-r border-[#244b75]">
      <div>
        {/* Branding header */}
        <div className="p-6 border-b border-[#244b75]/60 bg-[#152e4a]">
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-400" />
            <span>CHPH Portal</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 uppercase font-semibold tracking-wider">
            University of Windsor
          </p>
        </div>

        {/* User Card info */}
        <div className="p-4 mx-4 mt-6 bg-[#152e4a]/50 rounded-2xl border border-[#244b75]/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-white shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold truncate text-white">{user.name}</h2>
              <span className="text-xs text-emerald-300 font-medium capitalize bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-900/30">
                {user.role}
              </span>
            </div>
          </div>
          {user.role === "student" && user.major && (
            <p className="text-xs text-slate-300 mt-2 truncate font-medium flex items-center gap-1">
              <GraduationCap size={12} className="shrink-0 text-emerald-400" />
              <span className="truncate">{user.major}</span>
            </p>
          )}
          {user.role === "employer" && user.organization && (
            <p className="text-xs text-slate-300 mt-2 truncate font-medium flex items-center gap-1">
              <Building2 size={12} className="shrink-0 text-emerald-400" />
              <span className="truncate">{user.organization}</span>
            </p>
          )}
        </div>

        {/* Dynamic Navigation Links based on role */}
        <nav className="mt-8 flex flex-col gap-1.5 px-4">
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
                <span>Post a Job</span>
              </Link>
            </>
          )}

          {user.role === "supervisor" && (
            <>
              <Link to="/supervisor/review" className={linkClass("/supervisor/review")}>
                <ShieldCheck size={18} />
                <span>Pending Reviews</span>
              </Link>
              <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                <LayoutDashboard size={18} />
                <span>Analytics Dashboard</span>
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                <LayoutDashboard size={18} />
                <span>Analytics Dashboard</span>
              </Link>
              <Link to="/supervisor/review" className={linkClass("/supervisor/review")}>
                <ShieldCheck size={18} />
                <span>Pending Reviews</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-[#244b75]/40 mt-auto bg-[#152e4a]/20">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-200 hover:border-red-950/20 transition-all duration-200 font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
