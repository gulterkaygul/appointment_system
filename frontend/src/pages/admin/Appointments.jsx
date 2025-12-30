import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    if (status === "approved") return "bg-green-500/20 text-green-300";
    if (status === "cancelled") return "bg-red-500/20 text-red-300";
    return "bg-yellow-500/20 text-yellow-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B2A4A] flex items-center justify-center text-white">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-[#EAF4FF] p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Appointment Management
        </h1>

        <button
          onClick={() => navigate("/admin/appointments/new")}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl text-white font-semibold transition"
        >
          + Add Appointment
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full bg-[#0F3A5F] rounded-2xl overflow-hidden">
          <thead className="bg-[#134B7A] text-left">
            <tr>
              <th className="p-4">Patient</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Department</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr
                key={a.id}
                className="border-b border-white/10 hover:bg-[#134B7A]/40 transition"
              >
                {/* Patient */}
                <td className="p-4">
                  <div className="font-semibold">
                    {a.patient?.name || "Unknown"}
                  </div>
                  <div className="text-sm text-[#CFE6F7]">
                    {a.patient?.phone || "-"}
                  </div>
                </td>

                {/* Doctor */}
                <td className="p-4">
                  {a.doctor?.full_name
                    ? `Dr. ${a.doctor.full_name}`
                    : `Doctor #${a.doctor_id}`}
                </td>

                {/* Department */}
                <td className="p-4">
                  {a.department || "-"}
                </td>

                {/* Date */}
                <td className="p-4">
                  {new Date(a.appointment_time).toLocaleString()}
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusColor(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteAppointment(a.id)}
                    className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {appointments.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-white/70"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
