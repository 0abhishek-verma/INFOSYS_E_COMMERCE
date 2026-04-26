import axios from "axios";

const API = "http://localhost:8080/api/users";

const apiClient = axios.create({
  baseURL: API
});

// 🔥 ADD THIS
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerUser = (data) => {
  return apiClient.post("/register", data);
};

export const loginUser = (data) => {
  return axios.post(`${API}/login`, data); // keep normal
};

export const getDashboard = () => {
  return apiClient.get("/dashboard");
};