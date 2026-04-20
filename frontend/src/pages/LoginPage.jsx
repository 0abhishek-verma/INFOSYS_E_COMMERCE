import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

import "../styles/register.css";


function LoginPage() {

 const navigate = useNavigate();


 const [formData, setFormData] = useState({

    email:"",
    password:""

 });


 const handleChange = (e) => {

   setFormData({

      ...formData,
      [e.target.name]: e.target.value

   });

 };


 const handleSubmit = async(e)=>{

   e.preventDefault();

   try{

      const response =
      await loginUser(formData);

      localStorage.setItem(
         "token",
         response.data
      );

      alert("Login successful");

      navigate("/dashboard");

   }

   catch(error){

      alert("Invalid credentials");

   }

 };


 return (

  <form
    className="register-form"
    onSubmit={handleSubmit}
  >

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

      <button type="submit">
         Login
      </button>

      <button
        type="button"
        className="login-btn"
        onClick={() => navigate("/")}
      >
         Don't have an account? Sign Up
      </button>

  </form>

 );

}

export default LoginPage;