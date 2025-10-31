import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        MicroBlog
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/search" className="navbar-link">
              Search
            </Link>
            <Link to={`/profile/${user.id}`} className="navbar-link">
              {user.username}
            </Link>
            <button onClick={logout} className="btn logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link" style={{fontWeight:"bold"}}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
