import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL'den bilgileri alıyoruz
  const token = searchParams.get("token");
  const userType = searchParams.get("type"); // Admin mi Doctor mu?

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsUpdating(true);

    try {
      await resetPassword(token, password);
      
      setMessage("Key Authorized & Updated ✅");
      setIsError(false);

      // --- 🚀 DİNAMİK YÖNLENDİRME ---
      setTimeout(() => {
        if (userType === "admin") {
          navigate("/admin/login");
        } else if (userType === "doctor") {
          navigate("/doctor/login");
        } else {
          // Tip belirtilmemişse ana sayfaya gönder (Güvenlik için)
          navigate("/");
        }
      }, 2500);

    } catch (err) {
      setMessage("Authorization Failed ❌. Link might be expired.");
      setIsError(true);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] text-white p-6 overflow-hidden italic font-sans relative">
      {/* Tasarım kodların buraya gelecek (Yukarıda attığım karizmatik UI) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#0f172a]/95 w-full max-w-[500px] p-12 rounded-lg border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)] text-center"
      >
        <h1 className="text-4xl font-black uppercase text-[#f87171] mb-6">Security Override</h1>
        <form onSubmit={handleReset} className="space-y-6">
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b border-gray-700 w-full outline-none py-2 text-lg" 
            placeholder="New Secure Key"
          />
          <button type="submit" disabled={isUpdating} className="w-full bg-[#7f1d1d] py-4 font-bold uppercase hover:bg-[#991b1b] transition-all">
            {isUpdating ? "Updating..." : "Authorize Update"}
          </button>
        </form>
        {message && <p className={`mt-6 font-bold uppercase text-xs ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
      </motion.div>
    </div>
  );
}