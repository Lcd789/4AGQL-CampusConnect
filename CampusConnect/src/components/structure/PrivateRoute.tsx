// src/components/structure/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type PrivateRouteProps = {
  requiredRole?: "student" | "professor" | "any";
};

const PrivateRoute = ({ requiredRole = "any" }: PrivateRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole !== "any" && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;