import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);

    // exp is in seconds → convert to ms
    return decoded.exp * 1000 > Date.now();

  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;