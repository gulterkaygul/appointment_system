import API from "./api";

// Dashboard özet bilgileri
export const getDoctorDashboard = async () => {
  const res = await API.get("/doctor/dashboard");
  return res.data;
};

// Doktorun randevuları
export const getMyAppointments = async () => {
  const res = await API.get("/appointments/my");
  return res.data;
};

// Bugünkü randevular
export const getTodayAppointments = async () => {
  const res = await API.get("/doctor/appointments/today");
  return res.data;
};
