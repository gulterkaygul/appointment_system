import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error("User verisi okunamadı, session temizleniyor.");
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 1. Giriş yapılmamışsa login sayfasına at
  if (!token || !user) {
    return <Navigate to="/login" replace />; 
  }

  // 2. Rolleri normalize et (Login.jsx ile aynı mantık)
  const userRole = user.role ? String(user.role).toLowerCase().trim() : "";
  const requiredRole = role ? String(role).toLowerCase().trim() : "";

  // 3. Yetki Kontrolü
  // Eğer bu rota bir rol gerektiriyorsa ve kullanıcının rolü buna uymuyorsa
  if (requiredRole && userRole !== requiredRole) {
    console.warn(`Yetkisiz erişim denemesi! Gerekli: ${requiredRole}, Mevcut: ${userRole}`);
    
    // Kullanıcıyı kendi yetkisi dahilindeki dashboard'a geri savur
    // Bu sayede admin hastaya, hasta admin paneline giremez.
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  // Her şey yolundaysa (Giriş yapılmış ve rol doğruysa) içeri al
  return children ? children : <Outlet />;
}