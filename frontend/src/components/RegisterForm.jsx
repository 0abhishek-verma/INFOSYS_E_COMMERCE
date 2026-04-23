import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/register.css";

function RegisterForm() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:""
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  const [popup, setPopup] = useState({
    show:false,
    title:"",
    message:"",
    success:false
  });

  const showPopup = (title, message, success=false) => {
    setPopup({ show:true, title, message, success });
  };

  const checkPasswordStrength = (password) => {
    let strength = "weak";

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password)
    ) {
      strength = "strong";
    } else if (password.length >= 6) {
      strength = "medium";
    }

    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : "error"
    }));

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const validateForm = () => {

    let newErrors = {};

    if(!formData.name.trim()) newErrors.name = "error";
    if(!formData.email.includes("@")) newErrors.email = "error";
    if(formData.phone.length < 10) newErrors.phone = "error";

    const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if(!passwordRegex.test(formData.password)){
      newErrors.password = "error";
    }

    if(formData.password !== formData.confirmPassword){
      newErrors.confirmPassword = "error";
    }

    setErrors(newErrors);

    if(Object.keys(newErrors).length > 0){
      showPopup("Validation Error","Please fix highlighted fields");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(!validateForm()) return;

    try {

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      await registerUser(payload);

      showPopup(
        "Registration Successful",
        "Account created successfully",
        true
      );

      setFormData({
        name:"",
        email:"",
        phone:"",
        password:"",
        confirmPassword:""
      });

    } catch (error) {

      if(error.response){
        showPopup("Error", JSON.stringify(error.response.data));
      } else {
        showPopup("Error","Server connection failed");
      }

    }
  };

  return (
    <div className="auth-container">

      <form className="register-form" onSubmit={handleSubmit}>

        <h2>Create Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className={`input ${errors.name ? "error" : ""}`}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`input ${errors.email ? "error" : ""}`}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={`input ${errors.phone ? "error" : ""}`}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`input ${errors.password ? "error" : ""} ${passwordStrength}`}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`input ${errors.confirmPassword ? "error" : ""}`}
        />

        <button type="submit">Register</button>

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>

      </form>

      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">

            <h2>{popup.title}</h2>
            <p>{popup.message}</p>

            {popup.success && (
              <button
                className="popup-login"
                onClick={() => navigate("/login")}
              >
                Go To Login
              </button>
            )}

            <button
              className="popup-close"
              onClick={() => setPopup({...popup, show:false})}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default RegisterForm;