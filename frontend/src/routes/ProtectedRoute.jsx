import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Login değilse
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Rol uyuşmuyorsa
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  //  EN KRİTİK KISIM (nested route için)
  return children ? children : <Outlet />;
}
