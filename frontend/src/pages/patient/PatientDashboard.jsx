import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [showDoctor, setShowDoctor] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const patientName = user?.name || user?.email || "Patient";

  const data = {
    doctor: {
      name: "Dr. Ahmet Kaya",
      email: "ahmet.kaya@clinic.com",
      phone: "+90 555 123 45 67",
    },
    appointments: [
      {
        date: "2026-05-15",
        time: "10:00",
        note: "Root canal treatment - session 1",
        progress: 40,
        doctorMessage: "Take antibiotics before appointment",
      },
    ],
    medications: [
      { name: "Amoxicillin", dose: "500mg", usage: "3 times daily" },
      { name: "Ibuprofen", dose: "400mg", usage: "Only if pain occurs" },
    ],
    files: [
      { type: "X-Ray Scan", date: "2026-05-10" },
      { type: "Panoramic Film", date: "2026-04-20" },
    ],
  };

  const appointment = data.appointments[0];

  return (
    <div className="min-h-screen bg-[#050b1a] text-white px-6 py-8">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-[#0b1224] p-5 rounded-2xl">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              Patient Dashboard
            </h1>

            <p className="text-sm text-gray-300 mt-1">
              Welcome back,{" "}
              <span className="text-cyan-300">{patientName}</span> 👋
            </p>

            <p className="text-xs text-gray-500 mt-1">
              For your lovely smile ✨
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-5 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>

        {/* APPOINTMENT */}
        <div className="bg-gradient-to-r from-cyan-900 to-indigo-900 p-6 rounded-2xl">
          <h2 className="font-bold text-lg mb-2">📅 Next Appointment</h2>
          <p className="text-sm">
            {appointment.date} • {appointment.time}
          </p>
          <p className="text-xs text-gray-300 mt-2">
            Don’t miss your appointment. Please arrive 10 minutes early.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* APPOINTMENT */}
          <div className="bg-[#0b1224] p-5 rounded-2xl">
            <h3 className="font-bold mb-3">Appointment</h3>

            <p className="text-sm text-gray-400">{appointment.note}</p>

            <div className="w-full bg-gray-700 h-2 rounded mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${appointment.progress}%` }}
                className="h-2 bg-cyan-400 rounded"
              />
            </div>

            <p className="text-xs mt-2">
              {appointment.progress}% completed
            </p>

            <p className="text-xs mt-3 text-cyan-300">
              {appointment.doctorMessage}
            </p>
          </div>

          {/* DOCTOR */}
          <div className="bg-[#0b1224] p-5 rounded-2xl">
            <h3 className="font-bold mb-3">Doctor Contact</h3>

            <p>👨‍⚕️ {data.doctor.name}</p>

            <button
              onClick={() => setShowDoctor(!showDoctor)}
              className="mt-4 w-full bg-cyan-600 py-2 rounded-lg"
            >
              Contact Doctor
            </button>

            <AnimatePresence>
              {showDoctor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 bg-[#111b33] p-3 rounded-lg text-sm"
                >
                  <p>📧 {data.doctor.email}</p>
                  <p>📞 {data.doctor.phone}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MEDICATIONS */}
          <div className="bg-[#0b1224] p-5 rounded-2xl">
            <h3 className="font-bold mb-3">Medications</h3>

            {data.medications.map((m, i) => (
              <div key={i} className="bg-[#111b33] p-3 mb-2 rounded-lg">
                <p className="font-semibold">{m.name}</p>
                <p className="text-xs text-gray-400">{m.dose}</p>
                <p className="text-xs text-cyan-300">{m.usage}</p>
              </div>
            ))}
          </div>

          {/* FILES (MOCK ONLY) */}
          <div className="bg-[#0b1224] p-5 rounded-2xl">
            <h3 className="font-bold mb-3">Medical Files</h3>

            {data.files.map((f, i) => (
              <div
                key={i}
                onClick={() => setSelectedFile(f)}
                className="bg-[#111b33] p-3 mb-2 rounded-lg cursor-pointer hover:bg-[#1a2747]"
              >
                <p>{f.type}</p>
                <p className="text-xs text-gray-400">{f.date}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFile(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl h-[85vh] bg-[#0b1224] rounded-2xl shadow-2xl overflow-hidden flex"
              onClick={(e) => e.stopPropagation()}
            >

              {/* LEFT PANEL */}
              <div className="w-1/3 bg-[#0f1930] p-6 border-r border-white/10">
                <h2 className="text-xl font-bold text-cyan-400">
                  {selectedFile.type}
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  {selectedFile.date}
                </p>

                <div className="mt-6 space-y-3 text-sm text-gray-300">

                  <div className="bg-[#111b33] p-3 rounded-lg">
                    📄 Medical Record File
                  </div>

                  <div className="bg-[#111b33] p-3 rounded-lg">
                    🏥 Hospital System Data
                  </div>

                  <div className="bg-[#111b33] p-3 rounded-lg">
                    🔒 Confidential Patient Info
                  </div>

                </div>

                <button className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 py-2 rounded-lg">
                  Download (mock)
                </button>
              </div>

              {/* RIGHT PREVIEW (NO IMAGE / NO PDF) */}
              <div className="flex-1 bg-[#050b1a] flex items-center justify-center">

                <div className="text-center space-y-4">

                  <div className="text-cyan-400 text-6xl">
                    🩻
                  </div>

                  <h3 className="text-lg font-semibold">
                    {selectedFile.type}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Secure medical file preview (demo only)
                  </p>

                  <button
                    onClick={() => setSelectedFile(null)}
                    className="mt-4 bg-red-600 px-5 py-2 rounded-lg"
                  >
                    Close
                  </button>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}