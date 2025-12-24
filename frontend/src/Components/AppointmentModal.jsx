import { useState } from "react";
import AppointmentModal from "../components/AppointmentModal";

function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Yakın Doğu Üniversitesi Diş Hastanesi
      </h1>

      <p className="text-gray-600 mb-8 text-lg">
        Sağlıklı gülüşler için hızlı ve kolay randevu
      </p>

      <button
        onClick={() => setOpen(true)}
        className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
      >
        Randevu Al
      </button>

      {open && <AppointmentModal onClose={() => setOpen(false)} />}
    </div>
  );
}

export default Home;
