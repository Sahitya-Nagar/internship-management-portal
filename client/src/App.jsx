import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminInternships from "./pages/AdminInternships";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        
        {/* Main Content Area - padded to account for fixed sidebar */}
        <main className="flex-1 ml-64 p-8 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/internships" replace />} />
            <Route path="/internships" element={<AdminInternships />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
