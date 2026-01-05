import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

//  TOKEN INTERCEPTOR (LOGIN HARİÇ)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    //  Login isteğine token ekleme
    if (token && !config.url.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
