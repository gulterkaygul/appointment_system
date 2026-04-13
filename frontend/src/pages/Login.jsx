import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- AKILLI OTURUM KONTROLÜ (Çakışma Önleyici) ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const safeRole = user.role?.toLowerCase().trim();
        const currentPath = window.location.pathname.toLowerCase();

        if (safeRole) {
          // Eğer manuel olarak farklı bir login sayfasına gidilirse (Örn: admin/login)
          // ve mevcut yetki o rolle eşleşmiyorsa, eski oturumu temizle.
          const isTryingAdmin = currentPath.includes("admin");
          const isTryingDoctor = currentPath.includes("doctor");
          const isTryingPatient = currentPath.includes("patient");

          if (
            (isTryingAdmin && safeRole !== "admin") ||
            (isTryingDoctor && safeRole !== "doctor") ||
            (isTryingPatient && safeRole !== "patient")
          ) {
            console.log("Rol çakışması algılandı, oturum temizleniyor...");
            localStorage.clear();
          } else {
            // Rol ve URL uyumluysa veya genel /login sayfasındaysak yönlendir
            navigate(`/${safeRole}/dashboard`, { replace: true });
          }
        }
      } catch (e) {
        localStorage.clear();
      }
    }
  }, [navigate]);

  // --- STATES ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeForm, setActiveForm] = useState('login'); 
  const controls = useAnimation();

  // --- LOGIN MANTIĞI ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Giriş yapmadan önce her ihtimale karşı temizlik
      localStorage.clear();

      const data = await login(email, password);

      if (data && data.access_token) {
        const role = data.role ? String(data.role).toLowerCase().trim() : "patient";

        // Verileri taze taze kaydet
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({
          email: email,
          role: role,
        }));

        console.log("Giriş Başarılı. Yeni Rol:", role);

        // Dinamik Yönlendirme
        navigate(`/${role}/dashboard`, { replace: true });
      } else {
        setError("Giriş başarısız: Yetki belgesi alınamadı.");
      }
    } catch (err) {
      setError("E-posta veya şifre hatalı.");
      console.error("Login Error:", err);
    }
  };

  // --- ŞİFRE SIFIRLAMA MANTIĞI ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setForgotMessage("İşleniyor...");
      const res = await fetch("http://127.0.0.1:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setForgotMessage(data.message || "Bağlantı e-postanıza gönderildi.");
    } catch (err) {
      setForgotMessage("Sistem hatası. Tekrar deneyin.");
    }
  };

  // --- ANİMASYON AYARLARI ---
  useEffect(() => {
    let idleTimer;
    controls.start("push");
    const startIdleSequence = () => {
      idleTimer = setTimeout(() => {
        if (!isTyping) controls.start("lookAtForm");
      }, 5000);
    };
    const entranceTimer = setTimeout(() => {
      controls.start("pose");
      startIdleSequence();
    }, 4500); 
    return () => { clearTimeout(entranceTimer); clearTimeout(idleTimer); };
  }, [controls, isTyping]);

  const handleForgotClick = () => {
    setActiveForm('forgot');
    setForgotMessage("");
    controls.start({ y: [-50, 0], transition: { duration: 0.6, ease: "backOut" } });
  };

  const bodyVariants = {
    push: { d: "M60,50 C60,25 90,20 100,35 C110,20 140,25 140,50 C140,85 145,145 130,185 C125,200 115,205 105,190 C100,180 100,180 95,190 C85,205 70,200 65,185 C55,145 60,90 60,50 Z", y: [0, -3, 0], rotate: 0, transition: { y: { repeat: Infinity, duration: 0.75 } } },
    pose: { d: "M50,50 C50,25 85,20 100,35 C115,20 150,25 150,50 C150,85 150,140 135,180 C130,195 110,195 105,180 C100,170 100,170 95,180 C90,195 70,195 65,180 C50,140 50,85 50,50 Z", rotate: 0, x: 0, y: 0, transition: { duration: 0.8 } },
    lookAtForm: { rotate: 6, x: 20, y: 8, transition: { duration: 1.2, ease: "easeInOut" } }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] text-white p-6 overflow-hidden italic font-sans">
      <motion.div className="flex flex-row items-center justify-center w-fit relative" initial={{ x: "-110vw" }} animate={{ x: 0 }} transition={{ duration: 4.5 }}>
        
        {/* CHARACTER SECTION */}
        <div className="relative flex-shrink-0 z-20">
          <motion.div className="w-[350px] md:w-[450px]" animate={controls}>
            <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
              <defs><radialGradient id="toothGrad" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#d1e3f8" /></radialGradient></defs>
              <g>
                <motion.g variants={{ push: { x: [-15, 15, -15], y: [0, -8, 0], transition: { repeat: Infinity, duration: 1.5 } }, pose: { x: 0 }, lookAtForm: { x: 5 } }} animate={controls}><rect x="85" y="180" width="14" height="48" rx="7" fill="#475569" /><ellipse cx="95" cy="228" rx="12" ry="6" fill="#000" /></motion.g>
                <motion.g variants={{ push: { x: [15, -15, 15], y: [-8, 0, -8], transition: { repeat: Infinity, duration: 1.5 } }, pose: { x: -18, rotate: -20 }, lookAtForm: { x: -8, rotate: -5 } }} animate={controls}><rect x="105" y="180" width="14" height="48" rx="7" fill="#94a3b8" /><ellipse cx="115" cy="228" rx="12" ry="6" fill="#1e293b" /></motion.g>
              </g>
              <motion.path variants={bodyVariants} animate={controls} fill="url(#toothGrad)" stroke="#cbd5e1" strokeWidth="1" />
              <motion.path variants={{ push: { d: "M140,110 L220,110" }, pose: { d: "M145,125 Q120,155 95,140" }, lookAtForm: { d: "M145,115 Q135,125 120,135" } }} animate={controls} fill="none" stroke="#e0eefb" strokeWidth="10" strokeLinecap="round" />
              <motion.path variants={{ push: { d: "M135,100 Q180,95 220,100" }, pose: { d: "M55,125 Q85,155 115,140" }, lookAtForm: { d: "M75,115 Q90,125 105,135" } }} animate={controls} fill="none" stroke="#e0eefb" strokeWidth="10" strokeLinecap="round" />
              <motion.g variants={{ push: { x: 25, y: 0, scaleX: 1 }, pose: { x: 0, y: 0, scaleX: 1 }, lookAtForm: { x: 32, y: 12, scaleX: 0.75 } }} animate={controls} transition={{ duration: 1.2 }}>
                <motion.g variants={{ lookAtForm: { opacity: 0 }, pose: { opacity: 1 } }} animate={controls}><circle cx="70" cy="125" r="8" fill="#ffb3b3" opacity="0.4" /><circle cx="82" cy="110" r="5.5" fill="#020617" /></motion.g>
                <circle cx="130" cy="125" r="8" fill="#ffb3b3" opacity="0.4" /><circle cx="118" cy="110" r="5.5" fill="#020617" />
                <motion.path d="M92,140 Q100,145 108,140" variants={{ hover: { d: "M85,140 Q100,165 115,140", strokeWidth: 4 }, normal: { d: "M92,140 Q100,145 108,140" } }} initial="normal" whileHover="hover" fill="none" stroke="#020617" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
            </svg>
          </motion.div>
        </div>

        {/* --- FORM CONTAINER --- */}
        <div className="flex-shrink-0 z-10 -ml-28 md:-ml-36 relative bg-[#0f172a]/95 w-[650px] h-[480px] shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-row rounded-lg border border-white/5">
          <AnimatePresence mode="wait">
            {activeForm === 'login' ? (
              <motion.form 
                key="login" 
                onSubmit={handleLogin}
                onFocus={() => { setIsTyping(true); controls.start("pose"); }} 
                onBlur={() => setIsTyping(false)} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="w-full h-full grid grid-cols-2 gap-10 items-center px-16"
              >
                <div className="space-y-3 pr-10 border-r border-gray-800 text-left">
                  <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Access <br/> Granted</h1>
                  {error ? (
                     <p className="text-red-500 text-xs font-bold uppercase tracking-tighter pt-4">{error}</p>
                  ) : (
                     <p className="text-[#f87171] text-lg font-black tracking-widest pt-6 uppercase">Welcome!</p>
                  )}
                </div>
                <div className="space-y-8 flex flex-col">
                  <div className="border-b border-gray-700 focus-within:border-red-800 transition-colors pb-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="bg-transparent w-full outline-none text-base py-1" 
                      placeholder="user@system.com" 
                    />
                  </div>
                  <div className="border-b border-gray-700 focus-within:border-red-800 transition-colors pb-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="bg-transparent w-full outline-none text-base py-1" 
                      placeholder="****" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#7f1d1d] py-4 mt-8 rounded-sm font-bold uppercase tracking-widest hover:bg-[#991b1b] transition-all active:scale-95 cursor-pointer">Authorize</button>
                  <button type="button" onClick={handleForgotClick} className="text-[10px] text-gray-500 hover:text-[#f87171] uppercase tracking-widest cursor-pointer">Forgot Password?</button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="forgot" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col justify-center px-24 items-center"
              >
                <h1 className="text-4xl font-black mb-1 uppercase text-[#f87171]">Recovery</h1>
                <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-[0.2em]">Enter credentials</p>
                <form onSubmit={handleForgotPassword} className="w-full space-y-6">
                    <input 
                        type="email" 
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="bg-transparent border-b border-gray-700 w-full outline-none py-4 text-center text-lg focus:border-red-500 transition-colors" 
                        placeholder="EMAIL_ADDRESS" 
                    />
                    <button type="submit" className="w-full border border-[#7f1d1d] py-4 mt-2 uppercase font-bold hover:bg-[#7f1d1d] transition-all active:scale-95 cursor-pointer">
                        Send Link
                    </button>
                </form>
                {forgotMessage && (
                    <p className={`mt-4 text-[10px] font-bold uppercase ${forgotMessage.includes("error") ? "text-red-500" : "text-green-500"}`}>
                        {forgotMessage}
                    </p>
                )}
                <button 
                    type="button" 
                    onClick={() => {setActiveForm('login'); controls.start('pose');}} 
                    className="mt-8 text-[10px] underline uppercase tracking-widest text-gray-500 hover:text-white cursor-pointer"
                >
                    ← Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}