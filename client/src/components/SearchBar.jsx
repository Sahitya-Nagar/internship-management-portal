import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search size={20} className="text-slate-400" />
      </div>
      <input
        type="text"
        className="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 p-4 shadow-sm outline-none transition-all placeholder:text-slate-400"
        placeholder="Search internships by title, employer, profession or city..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
}
