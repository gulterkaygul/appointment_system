import { Navigate } from "react-router-dom";

export default function DoctorRoute({ children }) {
  const token = localStorage.getItem("doctor_token");

  if (!token) {
    return <Navigate to="/doctor/login" replace />;
  }

  return children;
}
