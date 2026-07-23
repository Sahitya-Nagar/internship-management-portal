import React from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function UWindsorLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Map route paths to friendly breadcrumb names
  const getPageTitle = (path) => {
    if (path.includes("/login") || path.includes("/register")) return "Authentication";
    if (path.includes("/jobs")) return "Job Board";
    if (path.includes("/employer/listings")) return "My Listings";
    if (path.includes("/employer/submit")) return "Post a Position";
    if (path.includes("/supervisor/review")) return "Review Queue";
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/employers")) return "Employers";
    if (path.includes("/admin/students")) return "Students";
    if (path.includes("/admin/placements")) return "Placements";
    if (path.includes("/student/applications")) return "My Applications";
    return "Portal";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      
      {/* 2. Main Header (White background for dark logo) */}
      <header className="bg-white border-b-[6px] border-lancer-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <img 
              src="https://www.uwindsor.ca/kinesiology/sites/all/themes/uwindsor_bootstrap/images/uwindsor_logo.svg" 
              alt="University of Windsor Logo" 
              className="h-10 sm:h-14 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* 4. Main Body Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Column Navigation (Only show if authenticated) */}
        {isAuthenticated && (
          <aside className="w-full md:w-64 flex-shrink-0">
            <Sidebar />
          </aside>
        )}

        {/* Right Column Content */}
        <div className="flex-1 min-w-0">
          {/* Page Title — hidden on login/register pages */}
          {!location.pathname.includes("/login") && !location.pathname.includes("/register") && (
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {pageTitle}
            </h2>
          )}

          {/* Render Routes */}
          <div className="content-area">
            {children}
          </div>
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
