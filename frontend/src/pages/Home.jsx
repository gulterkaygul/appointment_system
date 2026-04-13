import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import Footer from "../components/Footer";
import { login } from "../services/authService";

export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");

  const openModal = () => {
    const token = localStorage.getItem("token");
    if (token) setView("appointment");
    else setView("login");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setView("login");
  };

  // --- DÜZELTİLMİŞ YÖNLENDİRME MANTIĞI ---
  const handleModalLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      alert("Lütfen email ve şifre giriniz.");
      return;
    }

    try {
      const data = await login(email, password);
      
      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ email, role: data.role }));
        
        // HATA BURADAYDI: Rolü küçük harfe çevirerek kontrol ediyoruz
        const userRole = data.role ? data.role.toLowerCase() : "";
        
        console.log("Giriş yapan rol:", userRole); // Konsoldan kontrol edebilirsin

        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "doctor") {
          navigate("/doctor/dashboard");
        } else {
          // Geri kalan her şey (patient veya boş gelirse) buraya düşer
          navigate("/patient/dashboard");
        }
        
        setOpen(false);
      } else {
        alert("Giriş başarısız: Token alınamadı.");
      }
    } catch (err) {
      console.error("Hata detayı:", err);
      alert("Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    }
  };

  const handleConfirm = async () => {
    if (!name || !phone || !doctor || !department || !date || !time || !kvkk) {
      alert("Please fill in all required fields.");
      return;
    }
    alert("Appointment successfully created");
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-[#EAF4FF] overflow-x-hidden">
      <section className="relative w-full h-[75vh] flex overflow-hidden border-b border-white/10">
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className={`${open ? 'w-1/3 order-2' : 'w-2/3'} h-full relative`}
        >
          <img src="https://www.egitimajansi.com/images/uploads//3bb2ed00fde5327a95d662702e0b466f.jpg" alt="Dental Hospital" className="h-full w-full object-cover" />
          <div className={`absolute top-0 ${open ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} h-full w-48 from-[#0B2A4A] to-transparent`} />
        </motion.div>

        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className={`${open ? 'w-2/3 bg-[#0F3A5F]' : 'w-1/3 bg-gradient-to-b from-[#0F3A5F] to-[#0B2A4A]'} flex flex-col justify-center px-10 relative z-10`}
        >
          <AnimatePresence mode="wait">
            {!open ? (
              <motion.div key="hero-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <img src="https://upload.wikimedia.org/wikipedia/tr/1/10/Yak%C4%B1n_Do%C4%9Fu_%C3%9Cniversitesi.svg" alt="Logo" className="w-28 h-28 mb-6" />
                <h1 className="text-4xl font-bold mb-4 leading-tight">Near East University<br />Dental Hospital</h1>
                <p className="mb-6 text-lg text-[#D6E9F8]">Modern technology, expert dentists, patient-centered healthcare</p>
                <button onClick={openModal} className="w-fit px-10 py-4 bg-[#0A66C2] rounded-xl text-lg hover:bg-[#084C91] transition-transform transform hover:scale-105">Book Appointment</button>
              </motion.div>
            ) : (
              <motion.div key="form-view" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-lg mx-auto py-4">
                {view === "login" ? (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold mb-2 text-white">Giriş Yap</h2>
                    <input className="bg-[#0B2A4A] border border-blue-400/30 p-3 rounded-lg text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input className="bg-[#0B2A4A] border border-blue-400/30 p-3 rounded-lg text-white" type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} />
                    
                    <button type="button" onClick={handleModalLogin} className="bg-[#0A66C2] py-4 rounded-lg font-bold text-white shadow-md active:scale-95 transition-all">Giriş Yap ve Devam Et</button>
                    
                    <button onClick={() => setView("register")} className="text-blue-300 text-sm hover:underline">Üye ol ve Randevu al</button>
                    <button onClick={closeModal} className="text-gray-400 mt-4 text-sm">Vazgeç</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <h2 className="text-2xl font-bold mb-2">{view === "register" ? "Hızlı Üyelik & Randevu" : "Randevu Bilgileri"}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <input className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />
                      <input className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" placeholder="Phone *" value={phone} onChange={e => setPhone(e.target.value)} />
                      <input className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white col-span-2" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} />
                      {view === "register" && <input type="date" className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={birthDate} onChange={e => setBirthDate(e.target.value)} />}
                      <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={doctor} onChange={e => setDoctor(e.target.value)}>
                        <option value="">Select Doctor *</option>
                        <option value="6">Dr. Ahmet Kaya</option>
                        <option value="7">Dr. Elif Demir</option>
                      </select>
                      <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={department} onChange={e => setDepartment(e.target.value)}>
                        <option value="">Select Department *</option>
                        <option>Dental Examination</option>
                      </select>
                      <input type="date" className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={date} onChange={e => setDate(e.target.value)} />
                      <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={time} onChange={e => setTime(e.target.value)}>
                        <option value="">Time *</option>
                        {["08:00","09:00","10:00"].map(t => <option key={t}>{t}</option>)}
                      </select>
                      <textarea className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white col-span-2" rows={2} placeholder="Complaint" value={complaint} onChange={e => setComplaint(e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 text-xs mt-2 cursor-pointer text-white/70">
                      <input type="checkbox" className="accent-[#0A66C2]" checked={kvkk} onChange={e => setKvkk(e.target.checked)} />
                      I approve the consent text
                    </label>
                    <button onClick={handleConfirm} className="bg-[#0A66C2] py-3 rounded-lg font-bold mt-2 shadow-lg">Confirm Appointment</button>
                    <button onClick={() => setView("login")} className="text-gray-400 text-xs mt-2 underline">Geri Dön</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 text-white">
        <h3 className="text-3xl font-bold mb-6">Why Choose Us?</h3>
        <p className="max-w-4xl mb-12 text-lg text-[#CFE6F7]">Our Dental Hospital combines academic excellence and modern infrastructure.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Advanced Medical Technology", img: "https://neu.edu.tr/wp-content/uploads/2022/01/11/Yakin-Dogu-Universitesi-Dis-Hastanesi-scaled.jpg", text: "State-of-the-art diagnostic technologies." },
            { title: "Expert Academic Staff", img: "https://photos.wikimapia.org/p/00/08/10/12/94_big.jpg", text: "Highly experienced dentists." }
          ].map((item, i) => (
            <div key={i} className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
              <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#0B2A4A]/80" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}