import { useEffect, useState } from "react";
import { getMyAppointments } from "../../services/doctorApi";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    getMyAppointments().then((data) => {
      setAppointments(data);
    });
  }, []);

  if (appointments === null) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id}>
            {a.appointment_time} – patient {a.patient_id}
          </div>
        ))
      )}
    </div>
  );
}
