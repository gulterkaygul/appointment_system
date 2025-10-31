import { useState } from "react";

function AddPatient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/patients/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    const data = await response.json();
    alert("Hasta eklendi: " + data.name);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Yeni Hasta Ekle</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="İsim"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Ekle</button>
      </form>
    </div>
  );
}

export default AddPatient;
