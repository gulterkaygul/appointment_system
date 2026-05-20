import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ChatWidget from "../../components/ChatWidget";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // STATS
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // PATIENTS
      const patientsRes = await api.get("/patients/");
      setPatientCount(patientsRes.data.length);

      // APPOINTMENTS
      const appointmentsRes = await api.get("/appointments/");
      setAppointmentCount(appointmentsRes.data.length);

      // DOCTORS
      const doctorsRes = await api.get("/users/?role=doctor");
      setDoctorCount(doctorsRes.data.length);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-[#07111F] via-[#0B2A4A] to-[#12395C] text-white p-10">

      {/* BACKGROUND LIGHTS */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute top-[40%] left-[45%] w-[200px] h-[200px] bg-sky-400/10 blur-[100px] rounded-full"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight">
            Admin Dashboard
          </h1>

          <p className="text-[#C7DDF3] mt-3 text-lg">
            Hospital management & appointment control panel
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500/80 hover:bg-red-600 px-6 py-3 rounded-2xl
                     transition-all duration-300 shadow-lg backdrop-blur-md
                     border border-white/10 hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">

        {/* PATIENTS */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-3xl p-6 shadow-2xl"
        >
          <p className="text-[#9CC7E7] uppercase text-sm tracking-widest">
            Total Patients
          </p>

          <h2 className="text-5xl font-black mt-4">
            {patientCount}
          </h2>
        </motion.div>

        {/* APPOINTMENTS */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-3xl p-6 shadow-2xl"
        >
          <p className="text-[#9CC7E7] uppercase text-sm tracking-widest">
            Appointments
          </p>

          <h2 className="text-5xl font-black mt-4">
            {appointmentCount}
          </h2>
        </motion.div>

        {/* DOCTORS */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-3xl p-6 shadow-2xl"
        >
          <p className="text-[#9CC7E7] uppercase text-sm tracking-widest">
            Active Doctors
          </p>

          <h2 className="text-5xl font-black mt-4">
            {doctorCount}
          </h2>
        </motion.div>

      </div>

      {/* MAIN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

        {/* PATIENT MANAGEMENT */}
        <motion.div
          whileHover={{
            scale: 1.03,
            y: -5,
          }}
          transition={{ duration: 0.25 }}
          onClick={() => navigate("/admin/patients")}
          className="cursor-pointer group relative overflow-hidden
                     bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-[30px] p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

          <h2 className="text-3xl font-black mb-4 relative z-10">
            Patient Management
          </h2>

          <p className="text-[#D2E6F8] text-lg relative z-10">
            Add, edit and manage all hospital patients.
          </p>

          <button
            className="mt-8 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600
                       transition-all shadow-lg relative z-10"
          >
            Go to Patients →
          </button>
        </motion.div>

        {/* APPOINTMENT MANAGEMENT */}
        <motion.div
          whileHover={{
            scale: 1.03,
            y: -5,
          }}
          transition={{ duration: 0.25 }}
          onClick={() => navigate("/admin/appointments")}
          className="cursor-pointer group relative overflow-hidden
                     bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-[30px] p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

          <h2 className="text-3xl font-black mb-4 relative z-10">
            Appointment Management
          </h2>

          <p className="text-[#D2E6F8] text-lg relative z-10">
            Control all doctor appointments and schedules.
          </p>

          <button
            className="mt-8 px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600
                       transition-all shadow-lg relative z-10"
          >
            Go to Appointments →
          </button>
        </motion.div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-12 flex flex-wrap gap-5 relative z-10">

        <button
          onClick={() => navigate("/admin/appointments/new")}
          className="px-7 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600
                     hover:scale-105 transition-all shadow-xl font-semibold"
        >
          + Create Appointment
        </button>

        <button
          onClick={() => navigate("/admin/patients")}
          className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600
                     hover:scale-105 transition-all shadow-xl font-semibold"
        >
          View Patients
        </button>

      </div>

      {/* CHATBOT */}
      <ChatWidget />
    </div>
  );
}