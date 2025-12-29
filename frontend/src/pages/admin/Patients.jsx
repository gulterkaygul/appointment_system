import { useEffect, useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const token = localStorage.getItem("token");

  // 🔗 DB BAĞLANTISI – AYNI KALDI
  const fetchPatients = () => {
    fetch("http://127.0.0.1:8000/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setPatients);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ➕ ADD / ✏️ UPDATE
  const savePatient = () => {
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `http://127.0.0.1:8000/patients/${editing.id}`
      : "http://127.0.0.1:8000/patients";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone }),
    }).then(() => {
      setOpen(false);
      setEditing(null);
      setName("");
      setPhone("");
      fetchPatients(); // 🔄 DB'den tekrar çek
    });
  };

  // 🗑️ DELETE
  const deletePatient = (id) => {
    if (!window.confirm("Delete this patient?")) return;

    fetch(`http://127.0.0.1:8000/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(fetchPatients);
  };

  const openCreate = () => {
    setEditing(null);
    setName("");
    setPhone("");
    setOpen(true);
  };

  const openEdit = (patient) => {
    setEditing(patient);
    setName(patient.name || patient.full_name);
    setPhone(patient.phone);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2 bg-[#0A66C2] rounded-lg hover:bg-[#084C91]"
        >
          + Add Patient
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full bg-[#0F3A5F] rounded-xl overflow-hidden">
        <thead className="bg-[#0A66C2]">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t border-[#1E4E7A]">
              <td className="p-3">{p.name || p.full_name}</td>
              <td className="p-3">{p.phone}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => openEdit(p)}
                  className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePatient(p.id)}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black w-[350px] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Patient" : "Add Patient"}
            </h2>

            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={savePatient}
                className="px-4 py-2 bg-[#0A66C2] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
