import { Filter, X } from "lucide-react";

export default function FilterBar({ filters, activeFilters, onFilterChange, onClearFilters }) {
  if (!filters || Object.keys(filters).length === 0) return null;

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== "");

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter size={18} />
          <h3 className="font-semibold text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(filters).map(([key, options]) => (
          <div key={key} className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1 capitalize">
              {key}
            </label>
            <select
              value={activeFilters[key] || ""}
              onChange={(e) => onFilterChange(key, e.target.value)}
              className="w-full text-sm rounded-md border border-gray-300 py-1.5 px-2 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">All</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
