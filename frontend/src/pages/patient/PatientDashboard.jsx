import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [showDoctor, setShowDoctor] = useState(false);

  // 🔓 LOGOUT (HOME'A DÖNER)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Home.jsx
  };

  const data = {
    doctor: {
      name: "Dr. Ahmet Kaya",
      email: "ahmet.kaya@clinic.com",
      phone: "+90 555 123 45 67",
      department: "Dentistry",
    },

    appointments: [
      {
        id: 1,
        date: "2026-05-15",
        time: "10:00",
        status: "Upcoming",
        progress: 40,
        note: "Root canal treatment - session 1",
        doctorMessage: "Take antibiotics before appointment",
      },
    ],

    medications: [
      {
        name: "Amoxicillin",
        dose: "500mg",
        usage: "3 times daily after meals",
      },
      {
        name: "Ibuprofen",
        dose: "400mg",
        usage: "Only if pain occurs",
      },
    ],

    files: [
      { type: "X-Ray", date: "2026-05-10" },
      { type: "Panoramic Film", date: "2026-04-20" },
    ],
  };

  const appointment = data.appointments[0];

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            Patient Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            For your lovely smile ✨
          </p>
        </div>

        {/* 🚪 LOGOUT */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </motion.button>
      </div>

      {/* REMINDER */}
      <div className="bg-cyan-900 p-4 rounded-xl mb-6">
        <h2 className="font-bold">Next Appointment</h2>
        <p className="text-sm">
          {appointment.date} at {appointment.time}
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* APPOINTMENT */}
        <div className="bg-[#0b1224] p-5 rounded-xl">
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

        {/* DOCTOR CONTACT */}
        <div className="bg-[#0b1224] p-5 rounded-xl">
          <h3 className="font-bold mb-3">Doctor Contact</h3>

          <p>👨‍⚕️ {data.doctor.name}</p>

          <button
            onClick={() => setShowDoctor(!showDoctor)}
            className="mt-4 w-full bg-cyan-600 py-2 rounded"
          >
            Contact Doctor
          </button>

          <AnimatePresence>
            {showDoctor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-[#111b33] p-3 rounded text-sm"
              >
                <p>📧 {data.doctor.email}</p>
                <p>📞 {data.doctor.phone}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MEDICATIONS */}
        <div className="bg-[#0b1224] p-5 rounded-xl">
          <h3 className="font-bold mb-3">Medications</h3>

          {data.medications.map((m, i) => (
            <div key={i} className="bg-[#111b33] p-3 mb-2 rounded">
              <p className="font-semibold">{m.name}</p>
              <p className="text-xs text-gray-400">{m.dose}</p>
              <p className="text-xs text-cyan-300">{m.usage}</p>
            </div>
          ))}
        </div>

        {/* FILES */}
        <div className="bg-[#0b1224] p-5 rounded-xl">
          <h3 className="font-bold mb-3">Medical Files</h3>

          {data.files.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFile(f)}
              className="bg-[#111b33] p-3 mb-2 rounded cursor-pointer hover:bg-[#1a2747]"
            >
              <p>{f.type}</p>
              <p className="text-xs text-gray-400">{f.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FILE MODAL */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-[#0b1224] p-6 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-bold">{selectedFile.type}</h2>
              <p className="text-sm text-gray-400">{selectedFile.date}</p>

              <p className="mt-3 text-cyan-300">
                File preview area
              </p>

              <button
                onClick={() => setSelectedFile(null)}
                className="mt-4 bg-red-600 px-4 py-2 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}