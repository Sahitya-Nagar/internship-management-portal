import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import InternshipCard from "../components/InternshipCard";
import StatsBar from "../components/StatsBar";
import { Plus } from "lucide-react";

export default function AdminInternships() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    semester: "",
    payment: "",
    city: "",
    major: "",
    profession: "",
    year: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/test-data?${params.toString()}`);
      if (response.data.success) {
        setData(response.data.data);
        setCount(response.data.count);
        if (Object.keys(filterOptions).length === 0) {
          setFilterOptions(response.data.filters);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, activeFilters]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({
      semester: "",
      payment: "",
      city: "",
      major: "",
      profession: "",
      year: "",
    });
  };

  const paidCount = data.filter(d => d.payment?.toLowerCase() === "paid").length;
  const volunteerCount = data.filter(d => d.payment?.toLowerCase() === "volunteer").length;
  const employersCount = new Set(data.map(d => d.employer)).size;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Internship Positions</h2>
          <p className="text-gray-500 mt-1">Manage and track all internship openings</p>
        </div>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm text-sm">
          <Plus size={16} />
          Add Position
        </button>
      </div>

      <StatsBar 
        count={count} 
        paidCount={paidCount} 
        volunteerCount={volunteerCount} 
        employersCount={employersCount} 
      />

      <SearchBar value={search} onChange={setSearch} />
      
      <FilterBar 
        filters={filterOptions} 
        activeFilters={activeFilters} 
        onFilterChange={handleFilterChange} 
        onClearFilters={clearFilters}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg p-5 h-64 border border-gray-200 animate-pulse">
              <div className="w-2/3 h-6 bg-gray-200 rounded mb-4"></div>
              <div className="w-1/3 h-4 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <InternshipCard key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-700">No internships found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          <button 
            onClick={clearFilters}
            className="mt-4 text-gray-900 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
