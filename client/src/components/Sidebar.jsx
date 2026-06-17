import { LayoutDashboard, Briefcase, FileText, Users, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#08060d] h-screen fixed top-0 left-0 text-slate-300 flex flex-col shadow-xl z-20">
      <div className="p-6 border-b border-slate-800/50">
        <h1 className="text-xl font-bold text-white tracking-tight">Internship Portal</h1>
        <p className="text-sm text-slate-400 mt-1">Management System</p>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors">
          <LayoutDashboard size={20} className="text-slate-400" />
          <span className="font-medium">Dashboard</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 transition-colors">
          <Briefcase size={20} />
          <span className="font-medium">Internships</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors">
          <FileText size={20} className="text-slate-400" />
          <span className="font-medium">Applications</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors">
          <Users size={20} className="text-slate-400" />
          <span className="font-medium">Interns</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors mt-auto">
          <Settings size={20} className="text-slate-400" />
          <span className="font-medium">Settings</span>
        </a>
      </nav>
    </div>
  );
}
