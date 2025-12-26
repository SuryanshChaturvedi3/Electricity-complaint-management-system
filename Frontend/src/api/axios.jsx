import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // tumhara backend
  withCredentials: true             // JWT cookie ke liye
});

export default api;
