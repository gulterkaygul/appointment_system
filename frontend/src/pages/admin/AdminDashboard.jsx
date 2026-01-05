import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-[#EAF4FF] p-10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PATIENTS CARD */}
        <div
          onClick={() => navigate("/admin/patients")}
          className="cursor-pointer bg-[#0F3A5F] rounded-2xl p-8 shadow-xl
                     hover:bg-[#134B7A] transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-3">
               Patient Management
          </h2>
          <p className="text-[#CFE6F7]">
            Add, update or delete patients
          </p>

          <button className="mt-6 px-6 py-2 bg-[#0A66C2] rounded-lg hover:bg-[#084C91]">
            Go to Patients →
          </button>
        </div>

        {/* APPOINTMENTS CARD */}
        <div
          onClick={() => navigate("/admin/appointments")}
          className="cursor-pointer bg-[#0F3A5F] rounded-2xl p-8 shadow-xl
                     hover:bg-[#134B7A] transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-3">
               Appointment Management
          </h2>
          <p className="text-[#CFE6F7]">
            View and manage all doctors’ appointments
          </p>

          <button className="mt-6 px-6 py-2 bg-[#0A66C2] rounded-lg hover:bg-[#084C91]">
            Go to Appointments →
          </button>
        </div>

      </div>
    </div>
  );
}
