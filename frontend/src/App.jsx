import { useState } from "react";
import AddPatient from "./pages/AddPatient";
import PatientList from "./pages/PatientList";

function App() {
  const [page, setPage] = useState("add");

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Diş Kliniği Randevu Sistemi</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPage("add")}>Hasta Ekle</button>
        <button onClick={() => setPage("list")}>Hasta Listesi</button>
      </div>

      {page === "add" ? <AddPatient /> : <PatientList />}
    </div>
  );
}

export default App;
