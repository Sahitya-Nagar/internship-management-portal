import { Link } from "react-router-dom";

export default function Login() {
  const portals = [
    { 
      id: "student", 
      label: "Student", 
      path: "/login/student",
      description: "Access your job applications and internship opportunities"
    },
    { 
      id: "employer", 
      label: "Employer", 
      path: "/login/employer",
      description: "Post positions and manage applications"
    },
    { 
      id: "supervisor", 
      label: "Supervisor", 
      path: "/login/supervisor",
      description: "Review and approve internship placements"
    },
    { 
      id: "admin", 
      label: "Administrator", 
      path: "/login/admin",
      description: "Manage the entire portal system"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          CHPH Internship Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select your portal to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {portals.map((portal) => (
              <Link
                key={portal.id}
                to={portal.path}
                className="group relative flex flex-col p-6 border border-gray-300 rounded-lg hover:border-gray-900 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                    {portal.label}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {portal.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  Continue
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  New to the portal?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="font-medium text-gray-900 hover:text-gray-700"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
