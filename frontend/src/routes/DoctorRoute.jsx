import { Navigate } from "react-router-dom";

export default function DoctorRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/doctor/login" replace />;
  }

  if (user.role !== "doctor") {
    return <Navigate to="/" replace />;
  }

  return children;
}
