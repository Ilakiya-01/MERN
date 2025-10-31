import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // On component load, fetch details from localStorage
    setRole(localStorage.getItem("role"));
    setEmail(localStorage.getItem("email"));
  }, []);

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/"); // back to login
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            SurveyApp
          </Link>

          {/* Admin links */}
          {role === "admin" && (
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/admin"
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
              >
                Manage Questions
              </Link>
              <Link
                to="/admin"
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
              >
                View Responses
              </Link>
            </div>
          )}

          {/* User links */}
          {role === "user" && (
            <div className="flex items-center gap-3">
              <Link
                to="/user"
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
              >
                Take Survey
              </Link>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {email ? (
            <>
              <span className="text-sm text-gray-600">{email}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
