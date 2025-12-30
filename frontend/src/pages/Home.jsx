import { useState } from "react";
import Footer from "../components/Footer";

export default function Home() {
  const [open, setOpen] = useState(false);

  // FORM STATES
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [kvkk, setKvkk] = useState(false);

  // Modal animation
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setOpen(true);
    setTimeout(() => setShowModal(true), 50);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setOpen(false), 300);
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

      alert("Appointment successfully created ✅");
      closeModal();

      setName("");
      setPhone("");
      setDoctor("");
      setDepartment("");
      setDate("");
      setTime("");
      setComplaint("");
      setKvkk(false);
    } catch {
      alert("Something went wrong ❌");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0B2A4A] text-[#EAF4FF]">

        {/* ================= HERO ================= */}
        <section className="relative w-full h-[70vh] flex overflow-hidden">
          <div className="w-2/3 h-full relative">
            <img
              src="https://www.egitimajansi.com/images/uploads//3bb2ed00fde5327a95d662702e0b466f.jpg"
              alt="Dental Hospital"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-[#0B2A4A] to-transparent" />
          </div>

          <div className="w-1/3 flex flex-col justify-center px-10 bg-gradient-to-b from-[#0F3A5F] to-[#0B2A4A]">
            <img
              src="https://upload.wikimedia.org/wikipedia/tr/1/10/Yak%C4%B1n_Do%C4%9Fu_%C3%9Cniversitesi.svg"
              alt="Logo"
              className="w-28 h-28 mb-6"
            />

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Near East University<br />
              Dental Hospital
            </h1>

            <p className="mb-6 text-lg text-[#D6E9F8]">
              Modern technology, expert dentists,
              patient-centered healthcare
            </p>

            <button
              onClick={openModal}
              className="w-fit px-10 py-4 bg-[#0A66C2] rounded-xl text-lg hover:bg-[#084C91] transition-transform transform hover:scale-105"
            >
              Book Appointment
            </button>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h3 className="text-3xl font-bold mb-6">Why Choose Us?</h3>
          <p className="max-w-4xl mb-12 text-lg text-[#CFE6F7]">
            Our Dental Hospital combines academic excellence, modern infrastructure,
            advanced medical technology and a patient-centered approach.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Advanced Medical Technology",
                text: "State-of-the-art diagnostic and treatment technologies.",
                img: "https://neu.edu.tr/wp-content/uploads/2022/01/11/Yakin-Dogu-Universitesi-Dis-Hastanesi-scaled.jpg",
              },
              {
                title: "Expert Academic Staff",
                text: "Highly experienced dentists and academic professionals.",
                img: "https://photos.wikimapia.org/p/00/08/10/12/94_big.jpg",
              },
              {
                title: "Patient-Centered Approach",
                text: "Comfort, safety and satisfaction at every stage.",
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyfJdxldDBxCwoEPotqMyAAQ8Uv4BgGrNpxA&s",
              },
              {
                title: "Modern & Comfortable Facilities",
                text: "Modern architecture and hygienic environment.",
                img: "https://neu.edu.tr/wp-content/uploads/2018/09/19/fotosuz-820-silinecek.jpg",
              },
            ].map((item, i) => (
              <div key={i} className="relative h-80 rounded-2xl overflow-hidden">
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
        <section className="bg-[#0B2A4A] px-6 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">Contact Us</h3>

              <p className="mb-2 font-semibold">Phone:</p>
              <p>+90 392 680 20 30</p>
              <p>+90 392 680 20 25</p>

              <p className="mt-4 mb-2 font-semibold">Email:</p>
              <p>neudental@neu.edu.tr</p>

              <p className="mt-4 mb-2 font-semibold">Address:</p>
              <p>Near East University</p>
              <p>Yakın Doğu Bulvarı, PK:922022</p>
              <p>Lefkoşa / KKTC</p>
              <p>Mersin 10 – Turkey</p>
            </div>

            <div>
              <p className="mb-2 font-semibold">Emergency / Hospital:</p>
              <p>Emergency: 153</p>
              <p>Hospital: +90 392 444 0 535</p>

              <p className="mt-4 mb-2 font-semibold">Working Hours:</p>
              <p>Monday - Friday: 09:00 - 17:30</p>
              <p>Saturday: 09:00 - 13:30</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </section>

        {/* ================= MODAL ================= */}
        {open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div
              className={`bg-white w-[380px] rounded-2xl p-6 shadow-2xl border-t-4 border-[#0A66C2] transition-transform ${
                showModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
              }`}
            >
              <h2 className="text-xl font-semibold text-center mb-4 text-black">
                Appointment Form
              </h2>

              <div className="flex flex-col gap-3">
                <input className="border p-2 text-black" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />
                <input className="border p-2 text-black" placeholder="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} />

                <select className="border p-2 text-black" value={doctor} onChange={e => setDoctor(e.target.value)}>
                  <option value="">Select Doctor *</option>
                  <option value="6">Dr. Ahmet Kaya</option>
                  <option value="7">Dr. Elif Demir</option>
                  <option value="8">Dr. Mehmet Yılmaz</option>
                  <option value="9">Dr. Ayşe Çelik</option>
                  <option value="10">Dr. Can Özkan</option>
                  <option value="11">Dr. Zeynep Arslan</option>
                </select>

                <select className="border p-2 text-black" value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="">Select Department *</option>
                  <option>Dental Examination</option>
                  <option>Tooth Filling</option>
                  <option>Root Canal Treatment</option>
                  <option>Orthodontics</option>
                </select>

                <input type="date" className="border p-2 text-black" value={date} onChange={e => setDate(e.target.value)} />

                <select className="border p-2 text-black" value={time} onChange={e => setTime(e.target.value)}>
                  <option value="">Select Time *</option>
                  {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                <textarea className="border p-2 text-black" rows={3} placeholder="Complaint (optional)" value={complaint} onChange={e => setComplaint(e.target.value)} />

                <label className="flex gap-2 text-black text-sm">
                  <input type="checkbox" checked={kvkk} onChange={e => setKvkk(e.target.checked)} />
                  I approve the consent text
                </label>

                <button onClick={handleConfirm} className="bg-[#0A66C2] text-white py-2 rounded-lg">
                  Confirm Appointment
                </button>

                <button onClick={closeModal} className="text-gray-500 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
