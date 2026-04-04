import React from 'react';

export default function PatientDashboard() {
  const handleLogout = () => {
    localStorage.clear(); // Tokenları temizle
    window.location.href = "/patient/login"; // Giriş sayfasına postala
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans italic">
      {/* Üst Başlık Kısmı */}
      <div className="border-b border-gray-800 pb-6 mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-[#f87171]">
          Patient <br/> Control Panel
        </h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-2">
          Accessing Secure Health Records... Authorized
        </p>
      </div>

      {/* İçerik Alanı (Geçici) */}
      <div className="grid gap-6">
        <div className="bg-[#0f172a] p-6 rounded border border-white/5 shadow-xl">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-widest text-gray-300">Welcome!</h2>
          <p className="text-sm text-gray-400">
            Golay gelsin tutkucum tasarim ellerinden oper
          </p>
        </div>

        {/* Güvenli Çıkış Butonu */}
        <button 
          onClick={handleLogout}
          className="w-full max-w-[200px] bg-[#7f1d1d] py-3 font-bold uppercase tracking-widest hover:bg-[#991b1b] transition-all text-xs"
        >
          Secure Logout
        </button>
      </div>
    </div>
  );
}