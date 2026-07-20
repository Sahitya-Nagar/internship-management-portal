import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
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

// Helper layout component that handles conditional sidebar rendering and padding
function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isPublicPage = ["/login", "/login/student", "/login/employer", "/login/supervisor", "/login/admin", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar only renders if the user is authenticated and not on a public login/register screen */}
      {isAuthenticated && !isPublicPage && <Sidebar />}

      {/* Adjust content padding dynamically depending on sidebar presence */}
      <main
        className={`flex-1 min-h-screen p-4 sm:p-8 transition-all ${
          isAuthenticated && !isPublicPage ? "ml-64 print:ml-0" : "ml-0"
        }`}
      >
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<LoginStudent />} />
          <Route path="/login/student" element={<LoginStudent />} />
          <Route path="/login/employer" element={<LoginEmployer />} />
          <Route path="/login/supervisor" element={<LoginSupervisor />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected routes */}
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

          {/* Employer Protected routes */}
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

          {/* Supervisor Protected routes */}
          <Route
            path="/supervisor/review"
            element={
              <ProtectedRoute allowedRoles={["supervisor", "admin"]}>
                <SupervisorReview />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employers"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <AdminEmployers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/placements"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <AdminPlacements />
              </ProtectedRoute>
            }
          />

          {/* Fallback route handles home redirect to login or dashboard */}
          <Route
            path="*"
            element={<HomeRedirect />}
          />
        </Routes>
      </main>
    </div>
  );
}

// Redirect user to their respective dashboard or login page
function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "student":
      return <Navigate to="/jobs" replace />;
    case "employer":
      return <Navigate to="/employer/listings" replace />;
    case "supervisor":
      return <Navigate to="/supervisor/review" replace />;
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;
