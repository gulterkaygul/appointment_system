import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL'den bilgileri alıyoruz
  const rawToken = searchParams.get("token");
  const userType = searchParams.get("type"); 

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsUpdating(true);

    // 🧹 KRİTİK DÜZELTME: Token içindeki olası kirlilikleri temizle
    // Eğer token URL'de bir şekilde & veya boşlukla karışmışsa ayıklıyoruz.
    if (!rawToken) {
      setMessage("Invalid Request: No token found ❌");
      setIsError(true);
      setIsUpdating(false);
      return;
    }

    const cleanToken = rawToken.split('&')[0].trim();

    try {
      // Backend'e temizlenmiş token'ı gönderiyoruz
      await resetPassword(cleanToken, password); 
      
      setMessage("Key Authorized & Updated ✅");
      setIsError(false);

      // --- 🚀 DİNAMİK YÖNLENDİRME ---
      setTimeout(() => {
        if (userType === "admin") {
          navigate("/admin/login");
        } else if (userType === "doctor") {
          navigate("/doctor/login");
        } else if (userType === "patient") {
          navigate("/login"); // Hasta girişi genelde düz /login olur
        } else {
          // Tip belirtilmemişse ana sayfaya gönder
          navigate("/");
        }
      }, 2500);

    } catch (err) {
      // Backend terminalinde yazan hatayı yakalar
      console.error("Reset Error:", err);
      setMessage("Authorization Failed ❌. Link might be expired.");
      setIsError(true);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] text-white p-6 overflow-hidden italic font-sans relative">
      
      {/* Arka Plan Süslemesi */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#0f172a]/95 w-full max-w-[500px] p-12 rounded-lg border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)] text-center"
      >
        <h1 className="text-4xl font-black uppercase text-[#f87171] mb-2">Security Override</h1>
        <p className="text-gray-500 text-xs mb-8 tracking-widest uppercase font-mono">System Protocol: Password_Reset_v2</p>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative">
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-b border-gray-700 w-full outline-none py-2 text-lg focus:border-red-500 transition-colors" 
              placeholder="New Secure Key"
            />
          </div>

          <button 
            type="submit" 
            disabled={isUpdating} 
            className="w-full bg-[#7f1d1d] py-4 font-bold uppercase hover:bg-[#991b1b] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
          >
            {isUpdating ? "Processing..." : "Authorize Update"}
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 font-bold uppercase text-xs tracking-tighter ${isError ? 'text-red-500' : 'text-green-400'}`}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}