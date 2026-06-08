import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PermissionRoute = ({ menuKey, children }) => {
  const { hasMenuAccess, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!hasMenuAccess(menuKey)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PermissionRoute;
