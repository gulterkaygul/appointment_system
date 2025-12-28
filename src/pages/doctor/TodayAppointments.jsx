import { useEffect, useState } from "react";
import { getTodayAppointments } from "../../services/doctorApi";

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToday = async () => {
      try {
        const res = await getTodayAppointments();
        setAppointments(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadToday();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Today’s Appointments</h2>

      {appointments.length === 0 && <p>No appointments today.</p>}

      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            ⏰ {new Date(a.appointment_time).toLocaleTimeString()} — Patient #{a.patient_id}
          </li>
        ))}
      </ul>
    </div>
  );
}
