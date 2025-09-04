import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API
  headers: {
    "Content-Type": "application/json"
  }
});

// Add auth token automatically if stored in localStorage
instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default instance;
