import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

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
                className="border rounded-lg p-2"
              />

              <input
                type="tel"
                placeholder="Phone Number *"
                className="border rounded-lg p-2"
              />

              <select className="border rounded-lg p-2">
                <option>Select Doctor *</option>
                <option>Dr. Aylin Yılmaz</option>
                <option>Dr. Mehmet Kaya</option>
                <option>Dr. Elif Demir</option>
              </select>

              <select className="border rounded-lg p-2">
                <option>Select Treatment *</option>
                <option>Dental Examination</option>
                <option>Tooth Filling</option>
                <option>Root Canal</option>
                <option>Orthodontics</option>
              </select>

              <input
                type="date"
                min="2026-01-01"
                className="border rounded-lg p-2"
              />

              <select className="border rounded-lg p-2">
                <option>Select Time *</option>
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
                className="border rounded-lg p-2"
                rows={3}
              />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                I approve the KVKK consent text
              </label>

              <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
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
