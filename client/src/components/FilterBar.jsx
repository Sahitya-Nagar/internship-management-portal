import { Filter, X } from "lucide-react";

export default function FilterBar({ filters, activeFilters, onFilterChange, onClearFilters }) {
  const filterKeys = [
    { key: "semester", label: "Semester" },
    { key: "payment", label: "Payment" },
    { key: "city", label: "City" },
    { key: "major", label: "Major" },
    { key: "profession", label: "Profession" },
    { key: "year", label: "Year" }
  ];

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2 text-slate-500 font-medium mr-2">
        <Filter size={18} />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="bg-indigo-100 text-indigo-700 text-xs py-0.5 px-2 rounded-full font-bold">
            {activeCount}
          </span>
        )}
      </div>

      {filterKeys.map(({ key, label }) => (
        <select
          key={key}
          value={activeFilters[key] || ""}
          onChange={(e) => onFilterChange(key, e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors min-w-[120px]"
        >
          <option value="">{label} (All)</option>
          {filters[`${key}s`]?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ))}

      {activeCount > 0 && (
        <button
          onClick={onClearFilters}
          className="ml-auto flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <X size={16} />
          Clear All
        </button>
      )}
    </div>
  );
}
