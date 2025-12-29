import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0F3A5F] p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/patients">Patients</Link>
          <Link to="/admin/appointments">Appointments</Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
