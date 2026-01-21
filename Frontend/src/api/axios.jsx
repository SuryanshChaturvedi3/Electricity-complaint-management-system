import axios from "axios";

const api = axios.create({
  baseURL: " import.meta.env.VITE_API_BASE_URL,", // tumhara backend
  withCredentials: true             // JWT cookie ke liye
});

export default api;
