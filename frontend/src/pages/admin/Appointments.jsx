import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ChatWidget from "../../components/ChatWidget";
import api from "../../services/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/");
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await api.delete(`/appointments/${id}/`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const statusColor = (status) => {
    if (status === "approved")
      return "bg-green-500/20 text-green-300 border border-green-400/20";

    if (status === "cancelled")
      return "bg-red-500/20 text-red-300 border border-red-400/20";

    return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07111F] via-[#0B2A4A] to-[#12395C] flex items-center justify-center text-white text-2xl font-bold">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#07111F] via-[#0B2A4A] to-[#12395C] text-[#EAF4FF] p-10">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px] bg-blue-500/20 blur-[120px] rounded-full"></div>

      {/* HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">

        <div>
          <h1 className="text-5xl font-black tracking-tight">
            Appointment Management
          </h1>

          <p className="text-[#BFD7EC] mt-3 text-lg">
            Manage all hospital appointments & schedules
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/appointments/new")}
          className="bg-gradient-to-r from-green-500 to-emerald-600
                     hover:scale-105 transition-all duration-300
                     px-6 py-3 rounded-2xl text-white font-bold
                     shadow-2xl"
        >
          + Add Appointment
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-3xl p-6 shadow-2xl"
        >
          <p className="uppercase tracking-widest text-sm text-[#9CC7E7]">
            Total Appointments
          </p>

          <h2 className="text-5xl font-black mt-4">
            {appointments.length}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-3xl p-6 shadow-2xl"
        >
          <p className="uppercase tracking-widest text-sm text-[#9CC7E7]">
            Approved
          </p>

          <h2 className="text-5xl font-black mt-4">
            {
              appointments.filter((a) => a.status === "approved").length
            }
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-3xl p-6 shadow-2xl"
        >
          <p className="uppercase tracking-widest text-sm text-[#9CC7E7]">
            Pending
          </p>

          <h2 className="text-5xl font-black mt-4">
            {
              appointments.filter((a) => a.status !== "approved").length
            }
          </h2>
        </motion.div>

      </div>

      {/* TABLE */}
      <div
        className="relative z-10 overflow-x-auto rounded-[30px]
                   bg-white/10 backdrop-blur-xl border border-white/10
                   shadow-2xl"
      >
        <table className="w-full overflow-hidden">

          <thead className="bg-white/10 text-left">
            <tr className="text-[#D8ECFF] uppercase text-sm tracking-wider">
              <th className="p-5">Patient</th>
              <th className="p-5">Doctor</th>
              <th className="p-5">Department</th>
              <th className="p-5">Date</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a, index) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                key={a.id}
                className="border-b border-white/10
                           hover:bg-white/5 transition-all duration-300"
              >

                {/* PATIENT */}
                <td className="p-5">
                  <div className="font-bold text-lg">
                    {a.patient?.name || "Unknown"}
                  </div>

                  <div className="text-sm text-[#BFD7EC] mt-1">
                    {a.patient?.phone || "-"}
                  </div>
                </td>

                {/* DOCTOR */}
                <td className="p-5 font-medium">
                  {a.doctor?.full_name
                    ? `Dr. ${a.doctor.full_name}`
                    : `Doctor #${a.doctor_id}`}
                </td>

                {/* DEPARTMENT */}
                <td className="p-5">
                  <span
                    className="px-4 py-2 rounded-full bg-cyan-500/10
                               border border-cyan-400/20 text-cyan-200 text-sm"
                  >
                    {a.department || "-"}
                  </span>
                </td>

                {/* DATE */}
                <td className="p-5 text-[#D9E9F8]">
                  {new Date(a.appointment_time).toLocaleString()}
                </td>

                {/* STATUS */}
                <td className="p-5">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-5 text-center">
                  <button
                    onClick={() => deleteAppointment(a.id)}
                    className="px-5 py-2 rounded-xl bg-red-500/80
                               hover:bg-red-600 transition-all duration-300
                               hover:scale-105 shadow-lg"
                  >
                    Delete
                  </button>
                </td>

              </motion.tr>
            ))}

            {appointments.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-10 text-white/60 text-lg"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* QUICK ACTIONS */}
      <div className="relative z-10 flex flex-wrap gap-5 mt-10">

        <button
          onClick={() => navigate("/admin")}
          className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600
                     transition-all hover:scale-105 shadow-xl"
        >
          Back Dashboard
        </button>

        <button
          onClick={fetchAppointments}
          className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600
                     transition-all hover:scale-105 shadow-xl"
        >
          Refresh
        </button>

      </div>

      {/* CHATBOT */}
      <ChatWidget />

    </div>
  );
}