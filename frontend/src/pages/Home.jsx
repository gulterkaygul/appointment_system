import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  // FORM STATES (Backend Safe)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [kvkk, setKvkk] = useState(false);

  const handleConfirm = async () => {
    if (!name || !phone || !doctor || !department || !date || !time || !kvkk) {
      alert("Please fill in all required fields and approve the consent text.");
      return;
    }

    const appointment_time = `${date}T${time}:00Z`;

    const payload = {
      patient_name: name,
      patient_phone: phone,
      doctor_id: Number(doctor),
      department: department,
      appointment_time,
      complaint,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      alert("Appointment successfully created ✅");
      setOpen(false);
      setName("");
      setPhone("");
      setDoctor("");
      setDepartment("");
      setDate("");
      setTime("");
      setComplaint("");
      setKvkk(false);
    } catch {
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2A4A]">
      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70vh] flex overflow-hidden">

        {/* SOL FOTOĞRAF */}
        <div className="w-2/3 h-full relative">
          <img
            src="https://www.egitimajansi.com/images/uploads//3bb2ed00fde5327a95d662702e0b466f.jpg"
            alt="Dental Hospital"
            className="h-full w-full object-cover"
          />

          {/* KOYU GEÇİŞ */}
          <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-[#0B2A4A] to-transparent" />
        </div>

        {/* SAĞ PANEL */}
        <div className="w-1/3 flex flex-col justify-center px-10 bg-gradient-to-b from-[#0F3A5F] to-[#0B2A4A] text-[#EAF4FF]">
          <img
            src="https://upload.wikimedia.org/wikipedia/tr/1/10/Yak%C4%B1n_Do%C4%9Fu_%C3%9Cniversitesi.svg"
            alt="Logo"
            className="w-28 h-28 mb-6"
          />

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Near East University<br />
            Dental Hospital
          </h1>

          <p className="mb-6 text-lg text-[#D6E9F8]">
            Modern technology, expert dentists,
            patient-centered healthcare
          </p>

          <button
            onClick={() => setOpen(true)}
            className="w-fit px-10 py-4 bg-[#0A66C2] rounded-xl text-lg hover:bg-[#084C91] transition"
          >
            Book Appointment
          </button>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-[#0B2A4A]">
        <h3 className="text-2xl font-semibold text-[#EAF4FF] mb-4">
          Why Choose Us?
        </h3>
        <p className="text-[#CFE6F7] max-w-3xl">
          We provide high-quality dental services with experienced professionals,
          advanced medical equipment and a strong focus on patient satisfaction.
        </p>
      </section>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[380px] rounded-2xl p-6 shadow-2xl border-t-4 border-[#0A66C2]">
            <h2 className="text-xl font-semibold text-center mb-4">
              Appointment Form
            </h2>

            <div className="flex flex-col gap-3">
              <input className="border rounded-lg p-2" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="border rounded-lg p-2" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <select className="border rounded-lg p-2" value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                <option value="">Select Doctor *</option>
                <option value="1">Dr. Canan Demir</option>
                <option value="2">Dr. Ahmet Yıldız</option>
                <option value="3">Dr. Elif Demir</option>
                <option value="4">Dr. Mehmet Kaya</option>
              </select>

              <select className="border rounded-lg p-2" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">Select Department *</option>
                <option>Dental Examination</option>
                <option>Tooth Filling</option>
                <option>Root Canal Treatment</option>
                <option>Orthodontics</option>
              </select>

              <input className="border rounded-lg p-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

              <select className="border rounded-lg p-2" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Select Time *</option>
                {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <textarea className="border rounded-lg p-2" rows={3} placeholder="Describe your complaint (optional)" value={complaint} onChange={(e) => setComplaint(e.target.value)} />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} />
                I approve the consent text
              </label>

              <button onClick={handleConfirm} className="bg-[#0A66C2] text-white py-2 rounded-lg hover:bg-[#084C91] transition">
                Confirm Appointment
              </button>

              <button onClick={() => setOpen(false)} className="text-gray-500 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
