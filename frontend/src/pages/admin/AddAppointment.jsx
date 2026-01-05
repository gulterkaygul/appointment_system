import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AddAppointment() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [department, setDepartment] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [complaint, setComplaint] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //  Load patients & doctors
  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients/");
      setPatients(res.data);
    } catch {
      setError("Failed to load patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/users/?role=doctor");
      setDoctors(res.data);
    } catch {
      setDoctors([]);
    }
  };

  //  SAVE (ADMIN ENDPOINT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/appointments/admin", {
        patient_id: Number(patientId),
        doctor_id: Number(doctorId),
        department: department.trim(),
        appointment_time: new Date(appointmentTime).toISOString(),
        complaint: complaint || "",
      });

      alert("Appointment created successfully ");
      navigate("/admin/appointments");
    } catch (err) {
      console.error("BACKEND ERROR:", err.response?.data);
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data, null, 2)
          : "Failed to create appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Add Appointment</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0F3A5F] p-8 rounded-2xl max-w-2xl shadow-xl"
      >
        {error && (
          <pre className="bg-red-500/20 text-red-200 p-4 rounded mb-6 text-sm overflow-x-auto">
            {error}
          </pre>
        )}

        {/* Patient */}
        <label className="block mb-2 font-semibold">Patient</label>
        <select
          className="w-full p-2 mb-6 rounded text-black"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.phone})
            </option>
          ))}
        </select>

        {/* Doctor */}
        <label className="block mb-2 font-semibold">Doctor</label>
        <select
          className="w-full p-2 mb-6 rounded text-black"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.full_name}
            </option>
          ))}
        </select>

        {/* Department */}
        <label className="block mb-2 font-semibold">Department</label>
        <input
          type="text"
          className="w-full p-2 mb-6 rounded text-black"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="e.g. Orthodontics"
          required
        />

        {/* Date & Time */}
        <label className="block mb-2 font-semibold">
          Appointment Date & Time
        </label>
        <input
          type="datetime-local"
          className="w-full p-2 mb-6 rounded text-black"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          required
        />

        {/* Complaint */}
        <label className="block mb-2 font-semibold">Complaint</label>
        <textarea
          className="w-full p-2 mb-8 rounded text-black"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Patient complaint..."
          rows="4"
        />

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl font-semibold transition"
          >
            {loading ? "Saving..." : "Save Appointment"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/appointments")}
            className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
