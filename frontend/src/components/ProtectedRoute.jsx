import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  clearAuth,
  getHomeRouteForRole,
  getStoredUser,
  getToken,
  isTokenValid,
} from "../services/api";

function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const token = getToken();
  const user = getStoredUser();

  if (!token || !isTokenValid(token) || !user?.role) {
    clearAuth();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
