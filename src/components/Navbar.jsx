import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../contexts/AuthContext.jsx';
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link
          to="/"
          className="navbar-logo"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Wellness Portal
        </Link>
      </div>

      <nav className="navbar-links">
        <Link to="/public-info">Public Info</Link>
        {user?.role === "patient" && (
          <Link to="/patient/dashboard">Patient Dashboard</Link>
        )}
        {user?.role === "provider" && (
          <Link to="/provider/dashboard">Provider Dashboard</Link>
        )}
        {user && <Link to="/profile">Profile</Link>}
      </nav>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">
              {user.name} ({user.role})
            </span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-text">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
