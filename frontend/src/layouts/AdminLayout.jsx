import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    //  Tüm auth verilerini temizle
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    //  Login sayfasına gönder
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0F3A5F] p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

          <nav className="flex flex-col gap-4">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/patients">Patients</Link>
            <Link to="/admin/appointments">Appointments</Link>
          </nav>
        </div>

        {/*  LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 hover:bg-red-700 py-2 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
