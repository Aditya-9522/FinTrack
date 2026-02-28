import axios from "axios";

const API = axios.create({
  baseURL: "https://fintrack-cagy.onrender.com/api"
});

// Attach token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;