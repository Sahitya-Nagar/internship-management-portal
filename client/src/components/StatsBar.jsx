import { Briefcase, DollarSign, Heart, Building2 } from "lucide-react";

export default function StatsBar({ count, paidCount, volunteerCount, employersCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
          <Briefcase size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Positions</p>
          <p className="text-2xl font-bold text-slate-900">{count}</p>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="bg-green-50 text-green-600 p-3 rounded-xl">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Paid Positions</p>
          <p className="text-2xl font-bold text-slate-900">{paidCount}</p>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
          <Heart size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Volunteer</p>
          <p className="text-2xl font-bold text-slate-900">{volunteerCount}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
          <Building2 size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Unique Employers</p>
          <p className="text-2xl font-bold text-slate-900">{employersCount}</p>
        </div>
      </div>
    </div>
  );
}
