import { useEffect, useState } from "react";

function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/patients/")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error("Veri alınamadı:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Hasta Listesi</h2>
      {patients.length === 0 ? (
        <p>Henüz hasta bulunmuyor.</p>
      ) : (
        <ul>
          {patients.map((p) => (
            <li key={p.id}>
              {p.name} - {p.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientList;
