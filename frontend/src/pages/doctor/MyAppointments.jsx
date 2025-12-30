import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const res = await api.get("/appointments/my"); // 🔥 DOĞRU ENDPOINT
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-300">{error}</div>;
  }

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-300">
          You have no appointments yet.
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-[#0F3A5F] p-4 rounded-xl shadow"
            >
              <p><b>Patient:</b> {a.patient.name}</p>
              <p><b>Phone:</b> {a.patient.phone}</p>
              <p><b>Department:</b> {a.department}</p>
              <p>
                <b>Date:</b>{" "}
                {new Date(a.appointment_time).toLocaleString()}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span className="capitalize">{a.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
