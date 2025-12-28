export default function Contact() {
  return (
    <div className="relative min-h-screen bg-[#0B2A4A] text-[#EAF4FF] px-6 py-20 overflow-hidden">

      {/* Sol bordomsi kenar efekti */}
      <div className="absolute top-0 left-0 h-full w-96 bg-gradient-to-r from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      {/* Sağ bordomsi kenar efekti */}
      <div className="absolute top-0 right-0 h-full w-96 bg-gradient-to-l from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      {/* Sayfa içeriği */}
      <div className="relative max-w-7xl mx-auto z-10 space-y-10">
        <h1 className="text-4xl font-bold text-center">Contact Us</h1>

        <p className="text-[#CFE6F7] text-center max-w-3xl mx-auto">
          For appointments, inquiries, or emergency services, please use the contact details or map below to find us quickly or get in touch with our team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* İletişim Bilgileri */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Phone</h2>
              <p className="text-[#CFE6F7]">+90 392 680 20 30</p>
              <p className="text-[#CFE6F7]">+90 392 680 20 25</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-1">Email</h2>
              <p className="text-[#CFE6F7]">neudental@neu.edu.tr</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-1">Address</h2>
              <p className="text-[#CFE6F7]">
                Near East University<br />
                Yakın Doğu Bulvarı, PK:922022<br />
                Lefkoşa/KKTC<br />
                Mersin 10 – Turkey
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-1">Emergency / Hospital</h2>
              <p className="text-[#CFE6F7]">Emergency: 153</p>
              <p className="text-[#CFE6F7]">Hospital: +90 392 444 0 535</p>
            </div>

            {/* Çalışma Saatleri */}
            <div>
              <h2 className="text-xl font-semibold mb-1">Working Hours</h2>
              <p className="text-[#CFE6F7]">Monday - Friday: 09:00 - 17:30</p>
              <p className="text-[#CFE6F7]">Saturday: 09:00 - 13:30</p>
              <p className="text-[#CFE6F7]">Sunday: Closed</p>
            </div>
          </div>

          {/* Harita (Google Maps iframe) */}
          <div className="w-full h-64 md:h-full rounded-xl overflow-hidden border-4 border-[#0A66C2]">
            <iframe
              title="Near East University Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15574.322445528992!2d33.31618527873726!3d35.22673607207056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de111433eedaad%3A0xb704548b1127a239!2sNear%20East%20University!5e0!3m2!1sen!2s!4v1703624439396!5m2!1sen!2s"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
