import { Navigate } from "react-router-dom";

/**
 * Checks for astoix_token in localStorage.
 * No token → redirect to /admin/login.
 * Token found → render children (AdminLayout with its Outlet).
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("astoix_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
