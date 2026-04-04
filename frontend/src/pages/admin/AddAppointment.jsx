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

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients/");
      setPatients(res.data);
    } catch (err) {
      setError("Failed to load patients list.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/users/?role=doctor");
      setDoctors(res.data);
    } catch (err) {
      setDoctors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Gönderilecek veriyi hazırlıyoruz
    const payload = {
      patient_id: Number(patientId),
      doctor_id: Number(doctorId),
      department: department.trim(),
      appointment_time: new Date(appointmentTime).toISOString(),
      complaint: complaint.trim() || "", 
    };

    try {
      // DİKKAT: Endpoint'in sonunda ":" veya fazladan "/" olmadığından emin ol
      await api.post("/appointments/admin", payload);

      alert("Appointment created successfully! ✅");
      navigate("/admin/appointments");
    } catch (err) {
      console.error("FULL ERROR OBJECT:", err);
      
      // Backend'den gelen detaylı hatayı yakala
      const backendError = err.response?.data?.detail;
      setError(
        backendError 
          ? (typeof backendError === 'object' ? JSON.stringify(backendError, null, 2) : backendError)
          : "Server connection error (CORS or URL issue)."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white p-10 font-sans">
      <h1 className="text-3xl font-black mb-8 italic uppercase tracking-widest text-[#6EE7B7]">
        Add New Appointment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0F3A5F] p-8 rounded-2xl max-w-2xl shadow-2xl border border-white/10"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-xs font-mono">
            <p className="font-bold mb-1 underline">Validation Error / System Message:</p>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="space-y-5">
          {/* Patient */}
          <div>
            <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Select Patient</label>
            <select
              className="w-full p-3 rounded-xl text-black bg-gray-100 outline-none focus:ring-4 focus:ring-green-500/30 transition-all"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">-- Search Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Assign Doctor</label>
            <select
              className="w-full p-3 rounded-xl text-black bg-gray-100 outline-none focus:ring-4 focus:ring-green-500/30 transition-all"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              <option value="">-- Choose Specialist --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Department & Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Department</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl text-black outline-none focus:ring-4 focus:ring-green-500/30"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Surgery"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full p-3 rounded-xl text-black outline-none focus:ring-4 focus:ring-green-500/30"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Complaint */}
          <div>
            <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient Complaint</label>
            <textarea
              className="w-full p-3 rounded-xl text-black outline-none focus:ring-4 focus:ring-green-500/30"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Enter details..."
              rows="3"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#10B981] hover:bg-[#059669] py-3 rounded-xl font-black uppercase tracking-tighter shadow-lg shadow-green-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Appointment"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/appointments")}
            className="px-8 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all font-bold uppercase text-xs tracking-widest"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}