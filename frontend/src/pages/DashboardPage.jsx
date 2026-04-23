import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/dashboard.css";

function DashboardPage() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setUser({
        email: decoded.sub,      // email from subject
        name: decoded.name || "" // custom claim
      });

    } catch (error) {
      console.error("Invalid token");
      navigate("/login");
    }

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div className="dashboard-container">

      <div className="dashboard-card">

        <h1>Welcome 🎉</h1>

        <div className="user-info">
          <p><strong>Name:</strong> {user.name || "N/A"}</p>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </div>

  );
}

export default DashboardPage;