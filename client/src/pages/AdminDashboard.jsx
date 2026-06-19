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
  Legend,
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

  // Analytics states
  const [summary, setSummary] = useState({
    studentsPlaced: 0,
    activeEmployers: 0,
    paidPercentage: 0,
    allTimeTotal: 0,
  });
  const [byDiscipline, setByDiscipline] = useState([]);
  const [byProvince, setByProvince] = useState([]);
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
          // Set default to latest semester if list is not empty
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

      // Fetch all reports in parallel
      const [
        summaryRes,
        disciplineRes,
        provinceRes,
        paidUnpaidRes,
        employersRes,
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/summary`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/by-discipline`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/by-province`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/paid-unpaid`, { headers, params }),
        axios.get(`${import.meta.env.VITE_API_URL}/analytics/top-employers`, { headers, params }),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (disciplineRes.data.success) setByDiscipline(disciplineRes.data.data);
      if (provinceRes.data.success) setByProvince(provinceRes.data.data);
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

  // Exporter: CSV Download
  const handleExportCSV = () => {
    // Generate CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Report Semester,${selectedSemester || "Overall"}\n`;
    csvContent += `Students Placed,${summary.studentsPlaced}\n`;
    csvContent += `Active Employers,${summary.activeEmployers}\n`;
    csvContent += `Paid Positions Percentage,${summary.paidPercentage}%\n`;
    csvContent += `All-Time Total Placements,${summary.allTimeTotal}\n\n`;

    // Discipline details
    csvContent += "Discipline Group,Placements Count\n";
    byDiscipline.forEach((d) => {
      csvContent += `"${d.discipline}",${d.count}\n`;
    });
    csvContent += "\n";

    // Province details
    csvContent += "Province,Placements Count\n";
    byProvince.forEach((p) => {
      csvContent += `"${p.province}",${p.count}\n`;
    });
    csvContent += "\n";

    // Top employers
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

  // Exporter: Print/PDF report
  const handlePrintPDF = () => {
    window.print();
  };

  const COLORS = ["#1a3a5c", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="max-w-7xl mx-auto font-sans print:p-0">
      {/* Header and Exporters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-slate-500 mt-1">
            Placements metrics and historical performance for Kinesiology internships
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Semester Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl shadow-sm text-sm">
            <Calendar size={16} className="text-slate-400" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent border-0 outline-none font-bold text-slate-700 focus:ring-0 cursor-pointer"
            >
              <option value="">Overall Placements</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Semester: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm font-bold text-sm transition-colors"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF/Print button */}
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#152e4a] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            <Printer size={16} />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Printer logo block */}
      <div className="hidden print:block border-b-2 border-slate-200 pb-6 mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] uppercase">
          CHPH Internship Placement Report
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          University of Windsor • Centre for Human Performance and Health
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Report Semester: {selectedSemester || "Overall Placements"} • Date Created:{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Four Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Students Placed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#1a3a5c]" />
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
              Students Placed
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? "..." : summary.studentsPlaced}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Active in selected semester
            </p>
          </div>
          <div className="h-12 w-12 bg-[#1a3a5c]/5 text-[#1a3a5c] rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        {/* Card 2: Active Employers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
              Active Employers
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? "..." : summary.activeEmployers}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Clinics & partners engaged
            </p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <Building size={24} />
          </div>
        </div>

        {/* Card 3: Paid positions % */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500" />
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
              Paid Positions
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? "..." : `${summary.paidPercentage}%`}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Compensation percentage
            </p>
          </div>
          <div className="h-12 w-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Card 4: All time total */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-purple-500" />
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
              All-Time Total
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? "..." : summary.allTimeTotal}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Total historical database
            </p>
          </div>
          <div className="h-12 w-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:block print:space-y-6">
        {/* Chart 1: Placements by Discipline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl print:shadow-none print:border-slate-200">
          <h2 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <Grid size={18} className="text-[#1a3a5c]" />
            Placements by Discipline
          </h2>
          <div className="h-80 w-full text-xs">
            {byDiscipline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDiscipline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="discipline" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.02)" }} />
                  <Bar dataKey="count" fill="#1a3a5c" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-semibold">
                No data available for selected semester
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Placements by Province */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl print:shadow-none print:border-slate-200">
          <h2 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <Grid size={18} className="text-[#1a3a5c]" />
            Placements by Province
          </h2>
          <div className="h-80 w-full text-xs">
            {byProvince.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byProvince} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="province" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.02)" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-semibold">
                No data available for selected semester
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Paid vs Unpaid breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl print:shadow-none print:border-slate-200">
          <h2 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <Grid size={18} className="text-[#1a3a5c]" />
            Compensation Breakdown
          </h2>
          <div className="h-80 w-full flex items-center justify-center">
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
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {paidUnpaid.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 font-semibold text-sm">
                  {paidUnpaid.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2.5 text-slate-600">
                      <div
                        className="h-3.5 w-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>
                        {item.name}: <strong className="text-slate-900">{item.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 font-semibold">No data available for selected semester</div>
            )}
          </div>
        </div>

        {/* Top Employers Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl print:shadow-none print:border-slate-200">
          <h2 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <Building size={18} className="text-[#1a3a5c]" />
            Top Partner Employers
          </h2>
          {topEmployers.length > 0 ? (
            <div className="overflow-x-auto text-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3">Employer Name</th>
                    <th className="pb-3 text-right">Placements Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {topEmployers.map((emp, i) => (
                    <tr key={emp.employer_name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <span className="h-6 w-6 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-bold text-slate-900">{emp.employer_name}</span>
                      </td>
                      <td className="py-4 text-right font-extrabold text-slate-800">
                        {emp.count} placements
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed text-slate-400 font-semibold">
              No top employers data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
