import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import "../styles/login.css";

function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false
  });

  const showPopup = (message, success = false) => {

    setPopup({
      show: true,
      message,
      success
    });

    setTimeout(() => {

      setPopup({
        show: false,
        message: "",
        success: false
      });

      if (success) {
        navigate("/dashboard");
      }

    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await loginUser(formData);

      const token = response.data;

      localStorage.setItem("token", token);

      // 🔥 decode JWT
      const decoded = jwtDecode(token);

      localStorage.setItem("user", JSON.stringify({
        email: decoded.sub,
        name: decoded.name || decoded.sub
      }));

      showPopup("Login Successful", true);

    } catch (error) {

      showPopup("Invalid Credentials");

    }
  };

  return (

    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>Welcome Back</h1>
        <p>Login to continue managing your account.</p>
      </div>

      {/* FORM */}
      <form className="login-form" onSubmit={handleSubmit}>

        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/")}
        >
          Don't have an account? Sign Up
        </button>

      </form>

      {/* POPUP */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>{popup.success ? "Success" : "Error"}</h2>
            <p>{popup.message}</p>
          </div>
        </div>
      )}

    </div>

  );
}

export default LoginPage;