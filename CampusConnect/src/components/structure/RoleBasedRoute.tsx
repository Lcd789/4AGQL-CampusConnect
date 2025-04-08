// src/components/structure/RoleBasedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type RoleBasedRouteProps = {
  studentComponent: React.ReactNode;
  professorComponent: React.ReactNode;
};

const RoleBasedRoute = ({ studentComponent, professorComponent }: RoleBasedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "student" ? studentComponent : professorComponent;
};

export default RoleBasedRoute;