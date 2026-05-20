import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import Footer from "../components/Footer";
import { login } from "../services/authService";

export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("login");
  const [chatOpen, setChatOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const openModal = () => {
  setView("login");
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
    // 1. Alanların doluluk kontrolü
    if (!name || !phone || !email || !doctor || !department || !date || !time || !kvkk) {
      alert("Please fill in all required fields.");
      return;
    }

    // Backend'in beklediği tarih + saat formatını birleştiriyoruz (Örn: 2026-05-20T14:00:00)
    const appointment_time = `${date}T${time}:00`;

    // Backend'deki şemaya (PublicAppointmentCreate) uygun veriyi hazırlıyoruz
    const requestBody = {
      patient_name: name,
      patient_phone: phone,
      email: email,
      doctor_id: parseInt(doctor),
      department: department,
      appointment_time: appointment_time,
      complaint: complaint || ""
    };

    console.log("🚀 [FRONTEND] Backend'e istek atılıyor:", requestBody);

    try {
      // 2. Python backend sunucuna gerçek bir ağ isteği fırlatıyoruz!
      const res = await fetch("http://127.0.0.1:8000/public/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok) {
        // BAŞARILI DURUM: Mailtrap tetiklendi!
        alert("Appointment successfully created! Check your Mailtrap inbox for activation mail.");
        
        // Form alanlarını sıfırla
        setName("");
        setPhone("");
        setDoctor("");
        setDepartment("");
        setDate("");
        setTime("");
        setComplaint("");
        setKvkk(false);
        closeModal();
      } else {
        // BACKEND'DEN HATA DÖNERSE (Örn: Saat çakışması veya DB hatası)
        alert(`Error (${res.status}): ${data.detail || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("❌ Sunucu bağlantı hatası:", err);
      alert("Could not connect to the backend server. Make sure your Python server is running!");
    }
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
                {/* MODERN LIVE CHAT WIDGET */}
<div className="mt-6">


  {/* CHAT PANEL */}
  {chatOpen && (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-4 w-full max-w-md bg-[#0F3A5F]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A66C2] text-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold">AI Support</span>
        </div>
        <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
          ✕
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="h-40 overflow-y-auto p-3 space-y-2 text-sm text-[#EAF4FF]">
        <div className="bg-[#0B2A4A] p-2 rounded-lg w-fit max-w-[80%]">
          Hi 👋 How can I help you today?
        </div>
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg bg-[#0B2A4A] text-white text-sm outline-none"
          placeholder="Type message..."
        />
        <button className="bg-[#0A66C2] px-4 rounded-lg text-sm hover:bg-[#084C91]">
          Send
        </button>
      </div>

    </motion.div>
  )}

</div>
              </motion.div>
            ) : (
              <motion.div key="form-view" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-lg mx-auto py-4">
                {view === "login" ? (
                  <div className="flex flex-col gap-3">
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
                      <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={doctor} onChange={e => setDoctor(e.target.value)}>
                        <option value="">Select Doctor *</option>
                        <option value="6">Dr. Ahmet Kaya</option>
                        <option value="7">Dr. Elif Demir</option>
                        <option value="10">Dr. Can Özkan</option>
                        <option value="9">Dr. Ayşe Çelik</option>
                        <option value="8">Dr. Mehmet Yılmaz</option>
                        <option value="11">Dr. Zeynep Arslan</option>

                      </select>
                      <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={department} onChange={e => setDepartment(e.target.value)}>
                        <option value="">Select Department *</option>
                        <option>Dental Examination</option>
                        <option>Tooth Filling</option>
                        <option>Root Canal Treatment</option>
                        <option>Orthodontics</option>
                      </select>
                      <input type="date" className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={date} onChange={e => setDate(e.target.value)} />
                      <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={time} onChange={e => setTime(e.target.value)}>
                        <option value="">Time *</option>
                        {[ "08:00",
                             "09:00",
                             "10:00",
                             "11:00",
                             "12:00",
                             "13:00",
                             "14:00",
                             "15:00",
                             "16:00",
                             "17:00"  ].map(t => ( <option key={t}>{t}</option>
))}
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
            {
              title: "Advanced Medical Technology",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1jw9Rw7hY0CvwRteiMer_xaNw1YLK-EpHUg&s",
              text: "State-of-the-art diagnostic technologies.",
            },
            {
              title: "Expert Academic Staff",
              img: "https://photos.wikimapia.org/p/00/08/10/12/94_big.jpg",
              text: "Highly experienced dentists.",
            },
            {
             title: "Modern Treatment Rooms",
             img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8MqYKQA_D2BsYr3Bf_IBFdIiEvw4NcuaNYQ&s",
             text: "Comfortable and modern patient rooms.",
  },
  {
             title: "24/7 Emergency Support",
             img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy53gD6BryALjB9zuNmu95ied0fRBIm104CQ&s",
             text: "Emergency dental healthcare services anytime.",
  },
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
      {/* CONTACT SECTION UPGRADED */}
<section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">

  <h3 className="text-4xl font-bold text-center mb-4">Contact Us</h3>

  <p className="text-center text-[#CFE6F7] max-w-3xl mx-auto mb-14">
    For appointments, inquiries, or emergency services, reach our dental hospital team anytime.
  </p>

  <div className="grid md:grid-cols-2 gap-12">

    {/* LEFT INFO */}
    <div className="space-y-8">

      <div>
        <h4 className="text-xl font-semibold mb-1">Phone</h4>
        <p className="text-[#CFE6F7]">+90 392 680 20 30</p>
        <p className="text-[#CFE6F7]">+90 392 680 20 25</p>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-1">Email</h4>
        <p className="text-[#CFE6F7]">neudental@neu.edu.tr</p>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-1">Address</h4>
        <p className="text-[#CFE6F7] leading-relaxed">
          Near East University<br />
          Yakın Doğu Bulvarı, PK:922022<br />
          Lefkoşa / KKTC<br />
          Mersin 10 – Turkey
        </p>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-1">Emergency / Hospital</h4>
        <p className="text-[#CFE6F7]">Emergency: 153</p>
        <p className="text-[#CFE6F7]">Hospital: +90 392 444 0 535</p>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-1">Working Hours</h4>
        <p className="text-[#CFE6F7]">Monday - Friday: 09:00 - 17:30</p>
        <p className="text-[#CFE6F7]">Saturday: 09:00 - 13:30</p>
        <p className="text-[#CFE6F7]">Sunday: Closed</p>
      </div>

    </div>

    {/* RIGHT CARD (MODERN UI AREA) */}
    <div className="bg-[#0F3A5F] border border-white/10 rounded-2xl p-8 shadow-xl">

      <h4 className="text-2xl font-bold mb-6">Quick Contact</h4>

      <div className="space-y-4">

        <input
          placeholder="Your Name"
          className="w-full p-3 rounded bg-[#0B2A4A] border border-white/10"
        />

        <input
          placeholder="Email"
          className="w-full p-3 rounded bg-[#0B2A4A] border border-white/10"
        />

        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full p-3 rounded bg-[#0B2A4A] border border-white/10"
        />

        <button className="w-full bg-[#0A66C2] py-3 rounded font-bold hover:bg-[#084C91] transition">
          Send Message
        </button>
        

      </div>
    </div>

  </div>
</section>
      <Footer />
      
    </div>
  );
} 