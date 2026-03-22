import axios from "axios";

const api = axios.create({
  // Ye pehle .env se localhost uthayega, deploy hone par Render wala URL
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://electricity-complaint-management-system-1.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;