import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ChatWidget from "../../components/ChatWidget";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // FETCH PATIENTS
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

  // SAVE PATIENT
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

      // 🔥 EMAIL SORUNU ÇÖZÜLDÜ
      body: JSON.stringify({
        name,
        phone,
        email,
      }),
    }).then((res) => {
      if (res.ok) {
        setOpen(false);
        setEditing(null);

        setName("");
        setPhone("");
        setEmail("");

        fetchPatients();
      } else {
        alert("Operation failed. Email may already exist.");
      }
    });
  };

  // DELETE
  const deletePatient = (id) => {
    if (!window.confirm("Delete this patient?")) return;

    fetch(`http://127.0.0.1:8000/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(fetchPatients);
  };

  // OPEN CREATE
  const openCreate = () => {
    setEditing(null);

    setName("");
    setPhone("");
    setEmail("");

    setOpen(true);
  };

  // OPEN EDIT
  const openEdit = (patient) => {
    setEditing(patient);

    setName(patient.name || patient.full_name);
    setPhone(patient.phone);
    setEmail(patient.email || "");

    setOpen(true);
  };

  // SEARCH FILTER
  const filteredPatients = patients.filter((p) => {
    const patientName = (p.name || p.full_name || "").toLowerCase();

    return (
      patientName.includes(search.toLowerCase()) ||
      (p.phone || "").includes(search) ||
      (p.email || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#07111F] via-[#0B2A4A] to-[#12395C] text-white p-8">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full"></div>

      {/* HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-4xl font-black">
            Patients
          </h1>

          <p className="text-[#B8D4EA] mt-2">
            Manage hospital patients and records
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search patient, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/10
                       rounded-2xl px-5 py-3 outline-none
                       focus:ring-2 focus:ring-cyan-400
                       text-white placeholder:text-gray-300"
          />

          {/* ADD BUTTON */}
          <button
            onClick={openCreate}
            className="px-6 py-3 rounded-2xl
                       bg-gradient-to-r from-cyan-500 to-blue-600
                       hover:scale-105 transition-all shadow-xl
                       font-semibold"
          >
            + Add Patient
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="relative z-10 mb-8">
        <div
          className="bg-white/10 backdrop-blur-xl border border-white/10
                     rounded-3xl p-6 inline-block shadow-2xl"
        >

          <p className="text-[#A9C9E7] uppercase text-sm tracking-widest">
            Total Patients
          </p>

          <h2 className="text-5xl font-black mt-2">
            {patients.length}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 overflow-hidden rounded-[30px]
                   border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl"
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-white/10 text-[#D6EAFB]">
              <tr>
                <th className="p-5 text-left">Patient</th>
                <th className="p-5 text-left">Phone</th>
                <th className="p-5 text-left">Email</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredPatients.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-white/10
                             hover:bg-white/5 transition-all"
                >

                  {/* PATIENT */}
                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div
                        className="w-12 h-12 rounded-full
                                   bg-gradient-to-br from-cyan-400 to-blue-600
                                   flex items-center justify-center
                                   font-bold text-lg shadow-lg"
                      >
                        {(p.name || p.full_name || "P")[0]}
                      </div>

                      <div>
                        <div className="font-semibold text-lg">
                          {p.name || p.full_name}
                        </div>

                        <div className="text-sm text-[#B9D5EB]">
                          Patient ID #{p.id}
                        </div>
                      </div>

                    </div>

                  </td>

                  {/* PHONE */}
                  <td className="p-5 text-[#DCEFFF]">
                    {p.phone}
                  </td>

                  {/* EMAIL */}
                  <td className="p-5 text-[#BFE4FF]">
                    {p.email || "-"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-5">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => openEdit(p)}
                        className="px-4 py-2 rounded-xl
                                   bg-yellow-500 hover:bg-yellow-600
                                   transition-all"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deletePatient(p.id)}
                        className="px-4 py-2 rounded-xl
                                   bg-red-500 hover:bg-red-600
                                   transition-all"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>
          </table>

          {/* EMPTY */}
          {filteredPatients.length === 0 && (
            <div className="p-12 text-center text-[#C9DEEF]">
              No patients found.
            </div>
          )}

        </div>

      </motion.div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0F2740] border border-white/10
                       text-white w-[400px] rounded-[30px] p-8 shadow-2xl"
          >

            <h2 className="text-3xl font-black mb-6">
              {editing ? "Edit Patient" : "Add Patient"}
            </h2>

            {/* NAME */}
            <input
              className="w-full bg-white/10 border border-white/10
                         p-4 rounded-2xl mb-4 outline-none
                         focus:ring-2 focus:ring-cyan-400"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* PHONE */}
            <input
              className="w-full bg-white/10 border border-white/10
                         p-4 rounded-2xl mb-4 outline-none
                         focus:ring-2 focus:ring-cyan-400"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* EMAIL */}
            <input
              type="email"
              className="w-full bg-white/10 border border-white/10
                         p-4 rounded-2xl mb-6 outline-none
                         focus:ring-2 focus:ring-cyan-400"
              placeholder="Patient Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-xl bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={savePatient}
                className="px-5 py-2 rounded-xl
                           bg-gradient-to-r from-cyan-500 to-blue-600
                           hover:scale-105 transition-all"
              >
                Save
              </button>

            </div>

          </motion.div>

        </div>
      )}

      {/* CHATBOT */}
      <ChatWidget />

    </div>
  );
}