import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from '../contexts/AuthContext.jsx';
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redirect to login (or public) if role mismatch
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
