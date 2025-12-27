import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Token otomatik ekleme
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("doctor_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
