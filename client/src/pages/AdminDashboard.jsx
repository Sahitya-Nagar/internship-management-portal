import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Building,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Calendar,
  Grid,
} from "lucide-react";

export default function AdminDashboard() {
  const { token } = useAuth();
  
  // Semester filter states
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const formatSemester = (semesterStr) => {
    if (!semesterStr) return "";
    const parts = semesterStr.split(" ");
    if (parts.length === 2) {
      return `${parts[0].charAt(0).toUpperCase()}-${parts[1].slice(-2)}`;
    }
    return semesterStr;
  };

  // Analytics states
  const [summary, setSummary] = useState({
    studentsPlaced: 0,
    activeEmployers: 0,
    paidPercentage: 0,
    allTimeTotal: 0,
  });
  const [byDiscipline, setByDiscipline] = useState([]);
  const [byCity, setByCity] = useState([]);
  const [paidUnpaid, setPaidUnpaid] = useState([]);
  const [topEmployers, setTopEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch semesters dropdown values on mount
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/analytics/semesters`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setSemesters(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedSemester(response.data.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching semesters:", err);
      }
    };
    fetchSemesters();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSemester) params.semester = selectedSemester;

      const headers = { Authorization: `Bearer ${token}` };

      const [
        summaryRes,
        disciplineRes,
        provinceRes,
        paidUnpaidRes,
        employersRes,
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/summary`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/by-discipline`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/by-city`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/paid-unpaid`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/top-employers`, { headers, params }),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (disciplineRes.data.success) setByDiscipline(disciplineRes.data.data);
      if (provinceRes.data.success) setByCity(provinceRes.data.data);
      if (paidUnpaidRes.data.success) setPaidUnpaid(paidUnpaidRes.data.data);
      if (employersRes.data.success) setTopEmployers(employersRes.data.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedSemester]);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Report Semester,${selectedSemester || "Overall"}\n`;
    csvContent += `Students Placed,${summary.studentsPlaced}\n`;
    csvContent += `Active Employers,${summary.activeEmployers}\n`;
    csvContent += `Paid Positions Percentage,${summary.paidPercentage}%\n`;
    csvContent += `All-Time Total Placements,${summary.allTimeTotal}\n\n`;

    csvContent += "Discipline Group,Placements Count\n";
    byDiscipline.forEach((d) => {
      csvContent += `"${d.discipline}",${d.count}\n`;
    });
    csvContent += "\n";

    csvContent += "City,Placements Count\n";
    byCity.forEach((c) => {
      csvContent += `"${c.city}",${c.count}\n`;
    });
    csvContent += "\n";

    csvContent += "Employer,Placements Count\n";
    topEmployers.forEach((e) => {
      csvContent += `"${e.employer_name}",${e.count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `CHPH_Kinesiology_Placement_Report_${selectedSemester || "Overall"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const COLORS = ["#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af"];
  const MODERN_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#ef4444", "#84cc16"];

  return (
    <div className="max-w-7xl mx-auto font-sans print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Placements metrics and historical performance for Kinesiology internships
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm">
            <Calendar size={16} className="text-gray-500" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent border-0 outline-none font-medium text-gray-900 focus:ring-0 cursor-pointer text-sm"
            >
              <option value="">Overall Placements</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {formatSemester(s)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border border-gray-200 shadow-sm font-medium text-sm transition-colors"
          >
            <FileSpreadsheet size={16} className="text-gray-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm transition-colors"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="hidden print:block border-b border-gray-200 pb-6 mb-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 uppercase">
          CHPH Internship Placement Report
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          University of Windsor • Centre for Human Performance and Health
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Report Semester: {selectedSemester ? formatSemester(selectedSemester) : "Overall Placements"} • Date Created:{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Four Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider block">
              Students Placed
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : summary.studentsPlaced}
            </p>
          </div>
          <div className="h-10 w-10 bg-gray-50 border border-gray-100 text-gray-700 rounded-md flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider block">
              Active Employers
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : summary.activeEmployers}
            </p>
          </div>
          <div className="h-10 w-10 bg-gray-50 border border-gray-100 text-gray-700 rounded-md flex items-center justify-center">
            <Building size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider block">
              Paid Positions
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : `${summary.paidPercentage}%`}
            </p>
          </div>
          <div className="h-10 w-10 bg-gray-50 border border-gray-100 text-gray-700 rounded-md flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider block">
              All-Time Total
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : summary.allTimeTotal}
            </p>
          </div>
          <div className="h-10 w-10 bg-gray-50 border border-gray-100 text-gray-700 rounded-md flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print:block print:space-y-6">
        {/* Chart 1: Placements by Discipline */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
            <Grid size={16} className="text-gray-400" />
            Placements by Discipline
          </h2>
          <div className="h-64 w-full text-xs">
            {byDiscipline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDiscipline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="discipline" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "#f9fafb" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                    {byDiscipline.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Placements by City */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
            <Grid size={16} className="text-gray-400" />
            Placements by City
          </h2>
          <div className="h-64 w-full text-xs">
            {byCity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="city" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "#f9fafb" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                    {byCity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MODERN_COLORS[(index + 2) % MODERN_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Paid vs Unpaid breakdown */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
            <Grid size={16} className="text-gray-400" />
            Compensation Breakdown
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            {paidUnpaid.length > 0 ? (
              <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="w-1/2 h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paidUnpaid}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {paidUnpaid.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MODERN_COLORS[(index + 4) % MODERN_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 text-sm">
                  {paidUnpaid.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-gray-600">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: MODERN_COLORS[(index + 4) % MODERN_COLORS.length] }}
                      />
                      <span>
                        {item.name}: <strong className="text-gray-900 font-medium">{item.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No data available</div>
            )}
          </div>
        </div>

        {/* Top Employers Table */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
            <Building size={16} className="text-gray-400" />
            Top Employers
          </h2>
          {topEmployers.length > 0 ? (
            <div className="overflow-x-auto text-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium text-xs uppercase tracking-wider">
                    <th className="pb-2 font-medium">Employer Name</th>
                    <th className="pb-2 font-medium text-right">Placements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {topEmployers.map((emp, i) => (
                    <tr key={emp.employer_name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <span className="text-gray-400 font-mono text-xs w-4">{i + 1}.</span>
                        <span className="font-medium text-gray-900">{emp.employer_name}</span>
                      </td>
                      <td className="py-3 text-right font-medium">
                        {emp.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-12 text-gray-400 text-sm">
              No employer data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
