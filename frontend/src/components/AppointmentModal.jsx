import { useState } from "react";

function AppointmentModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    doctor: "",
    treatment: "",
    date: "",
    time: "",
    complaint: "",
    kvkk: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  zorunlu alanlar
    if (
      !form.name ||
      !form.phone ||
      !form.doctor ||
      !form.treatment ||
      !form.date ||
      !form.time ||
      !form.kvkk
    ) {
      alert("Please fill all required fields.");
      return;
    }

    //  BACKEND FORMAT
    const payload = {
      patient_id: 1, // şimdilik sabit
      doctor_id: form.doctor === "Dr. A" ? 1 : 2,
      appointment_time: `${form.date}T${form.time}:00`,
      treatment: form.treatment,
      complaint: form.complaint,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Backend error:", err);
        throw new Error("Appointment failed");
      }

      alert("✅ Appointment successfully booked!");
      onClose();
    } catch (error) {
      alert(" Error while booking appointment");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-[360px] space-y-3"
      >
        <h2 className="text-xl font-semibold text-center">
          Book Appointment
        </h2>

        <input
          name="name"
          placeholder="Full Name *"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number *"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <select
          name="doctor"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          <option value="">Select Doctor *</option>
          <option value="Dr. A">Dr. A</option>
          <option value="Dr. B">Dr. B</option>
        </select>

        <select
          name="treatment"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          <option value="">Select Treatment *</option>
          <option value="Cleaning">Dental Cleaning</option>
          <option value="Filling">Filling</option>
          <option value="Root Canal">Root Canal</option>
          <option value="Implant">Implant</option>
        </select>

        <input
          type="date"
          name="date"
          min="2026-01-01"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <select
          name="time"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          <option value="">Select Time *</option>
          {[
            "08:00","09:00","10:00","11:00",
            "12:00","13:00","14:00","15:00",
            "16:00","17:00",
          ].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <textarea
          name="complaint"
          placeholder="Complaint (optional)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="kvkk" onChange={handleChange} />
          I accept KVKK
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Confirm Appointment
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-gray-500 text-sm"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AppointmentModal;
