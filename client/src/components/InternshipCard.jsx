import { MapPin, Calendar, GraduationCap } from "lucide-react";

export default function InternshipCard({ data }) {
  const isPaid = data.payment?.toLowerCase() === "paid";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {data.title}
          </h3>
          <p className="text-slate-500 font-medium mt-1">{data.employer}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
            isPaid
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          {data.payment}
        </span>
      </div>

      <div className="space-y-3 mt-4 mb-6 text-sm text-slate-600 flex-grow">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          <span>{data.city}, {data.province}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <span>{data.semester} {data.year}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-slate-400" />
          <span>{data.major} &bull; {data.profession}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 flex gap-3 border-t border-slate-50">
        <button className="flex-1 bg-[#08060d] hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl transition-colors">
          View Details
        </button>
        <button className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium text-slate-700 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
}
