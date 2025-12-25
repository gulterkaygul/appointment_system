import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  // form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [kvkk, setKvkk] = useState(false);

  const handleConfirm = async () => {
    if (
      !name ||
      !phone ||
      !doctor ||
      !department ||
      !date ||
      !time ||
      !kvkk
    ) {
      alert("Please fill all required fields and approve KVKK");
      return;
    }

    // 🔴 BACKEND'İN BEKLEDİĞİ DOĞRU DATETIME FORMAT
    const appointment_time = `${date}T${time}:00Z`;

    const payload = {
      patient_name: name,
      patient_phone: phone,
      doctor_id: Number(doctor),
      department: department,
      appointment_time: appointment_time,
      complaint: complaint,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Backend error:", errText);
        throw new Error("Request failed");
      }

      alert("Appointment created successfully ✅");

      // reset & close modal
      setOpen(false);
      setName("");
      setPhone("");
      setDoctor("");
      setDepartment("");
      setDate("");
      setTime("");
      setComplaint("");
      setKvkk(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mt-10">
        <h1 className="text-3xl font-bold">
          Near East University Dental Hospital
        </h1>
        <p className="text-gray-600 mt-2">
          Beautiful smiles start with healthy teeth
        </p>
      </header>

      {/* Hero */}
      <div className="mt-16">
        <button
          onClick={() => setOpen(true)}
          className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[380px] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-center mb-4">
              Appointment Form
            </h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-lg p-2"
              />

              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-lg p-2"
              />

              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="">Select Doctor *</option>
                <option value="1">Dt. Canan Demir</option>
                <option value="2">Dt. Ahmet Yıldız</option>
                <option value="3">Dt. Elif Demir</option>
                <option value="4">Dt. Mehmet Kaya</option>
              </select>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="">Select Department *</option>
                <option>Dental Examination</option>
                <option>Tooth Filling</option>
                <option>Root Canal</option>
                <option>Orthodontics</option>
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-lg p-2"
              />

              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="">Select Time *</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
                <option>13:00</option>
                <option>14:00</option>
                <option>15:00</option>
                <option>16:00</option>
                <option>17:00</option>
              </select>

              <textarea
                placeholder="Describe your complaint"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="border rounded-lg p-2"
                rows={3}
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={kvkk}
                  onChange={(e) => setKvkk(e.target.checked)}
                />
                I approve the KVKK consent text
              </label>

              <button
                onClick={handleConfirm}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Confirm Appointment
              </button>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 text-sm mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
