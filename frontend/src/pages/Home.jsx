import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("login"); // login, register, appointment

  // SENİN ORİJİNAL FORM STATE'LERİN (AYNEN KORUNDU)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [kvkk, setKvkk] = useState(false);

  // YENİ EKALANLAR
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setView("login");
  };

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
      department,
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
      alert("Appointment successfully created ");
      closeModal();
    } catch {
      alert("Something went wrong ");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0B2A4A] text-[#EAF4FF] overflow-x-hidden">
        
        {/* ================= HERO (ANIMASYONLU KISIM) ================= */}
        <section className="relative w-full h-[75vh] flex overflow-hidden border-b border-white/10">
          
          {/* HASTANE RESMİ (Açılınca Sağa Akacak) */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className={`${open ? 'w-1/3 order-2' : 'w-2/3'} h-full relative`}
          >
            <img
              src="https://www.egitimajansi.com/images/uploads//3bb2ed00fde5327a95d662702e0b466f.jpg"
              alt="Dental Hospital"
              className="h-full w-full object-cover"
            />
            <div className={`absolute top-0 ${open ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} h-full w-48 from-[#0B2A4A] to-transparent`} />
          </motion.div>

          {/* MAVİ PANEL / FORM (Açılınca Sola Akacak) */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className={`${open ? 'w-2/3 bg-[#0F3A5F]' : 'w-1/3 bg-gradient-to-b from-[#0F3A5F] to-[#0B2A4A]'} flex flex-col justify-center px-10 relative z-10`}
          >
            <AnimatePresence mode="wait">
              {!open ? (
                <motion.div 
                  key="hero-content"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/tr/1/10/Yak%C4%B1n_Do%C4%9Fu_%C3%9Cniversitesi.svg" alt="Logo" className="w-28 h-28 mb-6" />
                  <h1 className="text-4xl font-bold mb-4 leading-tight">Near East University<br />Dental Hospital</h1>
                  <p className="mb-6 text-lg text-[#D6E9F8]">Modern technology, expert dentists, patient-centered healthcare</p>
                  <button onClick={openModal} className="w-fit px-10 py-4 bg-[#0A66C2] rounded-xl text-lg hover:bg-[#084C91] transition-transform transform hover:scale-105">Book Appointment</button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form-view"
                  initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  className="w-full max-w-lg mx-auto py-4"
                >
                  {view === "login" ? (
                    <div className="flex flex-col gap-4">
                      <h2 className="text-3xl font-bold mb-2 text-white">Giriş Yap</h2>
                      <p className="text-[#D6E9F8] mb-4">Lütfen mail ve şifrenizle devam edin.</p>
                      <input className="bg-[#0B2A4A] border border-blue-400/30 p-3 rounded-lg text-white outline-none focus:border-blue-400" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                      <input className="bg-[#0B2A4A] border border-blue-400/30 p-3 rounded-lg text-white outline-none focus:border-blue-400" type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} />
                      <button onClick={() => setView("appointment")} className="bg-[#0A66C2] py-4 rounded-lg font-bold text-lg hover:bg-[#084C91]">Giriş Yap ve Devam Et</button>
                      <button onClick={() => setView("register")} className="text-blue-300 text-sm mt-4 hover:underline">Üye değil misiniz? Üye ol ve Randevu al</button>
                      <button onClick={closeModal} className="text-gray-400 mt-4 text-sm hover:text-white transition-colors">Vazgeç</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                      <h2 className="text-2xl font-bold mb-2">{view === "register" ? "Hızlı Üyelik & Randevu" : "Randevu Bilgileri"}</h2>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />
                        <input className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" placeholder="Phone *" value={phone} onChange={e => setPhone(e.target.value)} />
                        
                        {view === "register" && (
                          <>
                            <input className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} />
                            <div className="flex flex-col">
                                <label className="text-[10px] text-blue-300 ml-1 mb-1">Birth Date *</label>
                                <input type="date" className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                            </div>
                          </>
                        )}

                        <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={doctor} onChange={e => setDoctor(e.target.value)}>
                          <option value="">Select Doctor *</option>
                          <option value="6">Dr. Ahmet Kaya</option>
                          <option value="7">Dr. Elif Demir</option>
                          <option value="8">Dr. Mehmet Yılmaz</option>
                          <option value="9">Dr. Ayşe Çelik</option>
                        </select>
                        <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={department} onChange={e => setDepartment(e.target.value)}>
                          <option value="">Select Department *</option>
                          <option>Dental Examination</option>
                          <option>Tooth Filling</option>
                          <option>Root Canal Treatment</option>
                          <option>Orthodontics</option>
                        </select>
                        <div className="flex flex-col">
                            <label className="text-[10px] text-blue-300 ml-1 mb-1">Appointment Date *</label>
                            <input type="date" className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <select className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white mt-5" value={time} onChange={e => setTime(e.target.value)}>
                          <option value="">Time *</option>
                          {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map(t => <option key={t}>{t}</option>)}
                        </select>
                        <textarea className="bg-[#0B2A4A] border border-blue-400/30 p-2 rounded text-white col-span-2" rows={2} placeholder="Complaint (optional)" value={complaint} onChange={e => setComplaint(e.target.value)} />
                      </div>

                      <label className="flex items-center gap-2 text-xs mt-2 cursor-pointer">
                        <input type="checkbox" className="accent-[#0A66C2]" checked={kvkk} onChange={e => setKvkk(e.target.checked)} />
                        I approve the consent text
                      </label>
                      
                      <button onClick={handleConfirm} className="bg-[#0A66C2] py-3 rounded-lg font-bold mt-2 shadow-lg hover:bg-[#084C91] transition-colors">Confirm Appointment</button>
                      <button onClick={() => setView("login")} className="text-gray-400 text-xs mt-2 hover:text-white underline">Geri Dön</button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h3 className="text-3xl font-bold mb-6">Why Choose Us?</h3>
          <p className="max-w-4xl mb-12 text-lg text-[#CFE6F7]">
            Our Dental Hospital combines academic excellence, modern infrastructure, advanced medical technology and a patient-centered approach.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Advanced Medical Technology", img: "https://neu.edu.tr/wp-content/uploads/2022/01/11/Yakin-Dogu-Universitesi-Dis-Hastanesi-scaled.jpg", text: "State-of-the-art diagnostic and treatment technologies." },
              { title: "Expert Academic Staff", img: "https://photos.wikimapia.org/p/00/08/10/12/94_big.jpg", text: "Highly experienced dentists and academic professionals." },
              { title: "Patient-Centered Approach", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyfJdxldDBxCwoEPotqMyAAQ8Uv4BgGrNpxA&s", text: "Comfort, safety and satisfaction at every stage." },
              { title: "Modern & Comfortable Facilities", img: "https://neu.edu.tr/wp-content/uploads/2018/09/19/fotosuz-820-silinecek.jpg", text: "Modern architecture and hygienic environment." }
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

        {/* ================= CONTACT US ================= */}
        <section className="bg-[#0B2A4A] px-6 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-[#CFE6F7]">
            <div>
              <h3 className="text-3xl font-bold mb-6">Contact Us</h3>
              <p className="mb-2 font-semibold text-white">Phone:</p>
              <p>+90 392 680 20 30</p>
              <p>+90 392 680 20 25</p>
              <p className="mt-4 mb-2 font-semibold text-white">Email:</p>
              <p>neudental@neu.edu.tr</p>
              <p className="mt-4 mb-2 font-semibold text-white">Address:</p>
              <p>Near East University, Yakın Doğu Bulvarı, Lefkoşa / KKTC</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-white">Emergency / Hospital:</p>
              <p>Emergency: 153</p>
              <p>Hospital: +90 392 444 0 535</p>
              <p className="mt-4 mb-2 font-semibold text-white">Working Hours:</p>
              <p>Monday - Friday: 09:00 - 17:30</p>
              <p>Saturday: 09:00 - 13:30</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}