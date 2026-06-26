import { MapPin, Calendar, GraduationCap } from "lucide-react";

export default function InternshipCard({ data }) {
  const isPaid = data.payment?.toLowerCase() === "paid";

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {data.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{data.employer}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isPaid
              ? "bg-gray-100 text-gray-800"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          }`}
        >
          {data.payment}
        </span>
      </div>

      <div className="space-y-2 mt-2 mb-5 text-sm text-gray-600 flex-grow">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <span>{data.city}, {data.province}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{data.semester} {data.year}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap size={14} className="text-gray-400" />
          <span className="truncate">{data.major} &bull; {data.profession}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 flex gap-2 border-t border-gray-100">
        <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
          View Details
        </button>
        <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-md text-sm font-medium text-gray-700 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
}
