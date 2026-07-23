import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginStudent from "./pages/LoginStudent.jsx";
import LoginEmployer from "./pages/LoginEmployer.jsx";
import LoginSupervisor from "./pages/LoginSupervisor.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import Register from "./pages/Register.jsx";

import StudentJobBoard from "./pages/StudentJobBoard.jsx";
import StudentApplications from "./pages/StudentApplications.jsx";

import EmployerJobForm from "./pages/EmployerJobForm.jsx";
import EmployerListings from "./pages/EmployerListings.jsx";

import SupervisorReview from "./pages/SupervisorReview.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminEmployers from "./pages/AdminEmployers.jsx";
import AdminStudents from "./pages/AdminStudents.jsx";
import AdminPlacements from "./pages/AdminPlacements.jsx";

function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* 1. Utility Bar */}
      <div className="bg-[#002244] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-end gap-4 text-[11px] text-gray-300 font-semibold tracking-wider uppercase">
          <a href="#" className="hover:text-white transition-colors">UWinGmail</a>
          <a href="#" className="hover:text-white transition-colors">Brightspace</a>
          <a href="#" className="hover:text-white transition-colors">UWinsite</a>
          <a href="#" className="hover:text-white transition-colors">Directory</a>
        </div>
      </div>

      {/* 2. Main Header (White background for dark logo) */}
      <header className="bg-white border-b-[6px] border-lancer-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <img 
              src="https://www.uwindsor.ca/kinesiology/sites/all/themes/uwindsor_bootstrap/images/uwindsor_logo.svg" 
              alt="University of Windsor Logo" 
              className="h-10 sm:h-14 w-auto"
            />
          </div>
          <div className="hidden sm:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-48 lg:w-64 py-1.5 px-3 border border-gray-300 rounded-sm text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-lancer-blue-900"
              />
              <button className="absolute right-0 top-0 h-full px-3 bg-lancer-blue-900 hover:bg-lancer-blue-800 text-white rounded-r-sm font-bold text-sm transition-colors">
                GO
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Department Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-xl font-bold text-gray-900">
            CHPH Internship Portal
          </h1>
        </div>
      </div>

      {/* 4. Main Body Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {isAuthenticated && (
          <aside className="w-full md:w-64 flex-shrink-0">
            <Sidebar />
          </aside>
        )}
        
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </main>

      {/* 5. Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img 
                src="https://www.uwindsor.ca/kinesiology/sites/all/themes/uwindsor_bootstrap/images/uwindsor_logo.svg" 
                alt="University of Windsor Logo" 
                className="h-10 w-auto mb-4 opacity-50 grayscale"
              />
              <p className="text-sm">401 Sunset Avenue<br/>Windsor, Ontario, Canada<br/>N9B 3P4</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact Us</h3>
              <p className="text-sm">Phone: 519-253-3000<br/>Email: info@uwindsor.ca</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Campus Map</a></li>
                <li><a href="#" className="hover:text-white">Important Dates</a></li>
                <li><a href="#" className="hover:text-white">Directory</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
            &copy; {new Date().getFullYear()} University of Windsor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login/student" replace />} />
        <Route path="/login/student" element={<LoginStudent />} />
        <Route path="/login/employer" element={<LoginEmployer />} />
        <Route path="/login/supervisor" element={<LoginSupervisor />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentJobBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/submit"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerJobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/listings"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerListings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supervisor/review"
          element={
            <ProtectedRoute allowedRoles={["supervisor"]}>
              <SupervisorReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEmployers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/placements"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPlacements />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
