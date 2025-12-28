export default function Doctors() {
  const doctors = [
    {
      name: "Dr. Canan Demir",
      title: "Orthodontist",
      img: "https://png.pngtree.com/png-clipart/20230918/ourmid/pngtree-happy-beautiful-doctor-smiling-while-showing-something-png-image_10132993.png",
    },
    {
      name: "Dr. Ahmet Yıldız",
      title: "Endodontist",
      img: "https://png.pngtree.com/png-vector/20240513/ourmid/pngtree-ai-generated-young-handsome-doctor-with-stethoscope-art-png-image_12441086.png",
    },
    {
      name: "Dr. Elif Demir",
      title: "Pediatric Dentist",
      img: "https://png.pngtree.com/png-vector/20241109/ourmid/pngtree-a-confident-and-caring-young-woman-doctor-with-warm-smile-png-image_14336533.png",
    },
    {
      name: "Dr. Mehmet Kaya",
      title: "Prosthodontist",
      img: "https://png.pngtree.com/png-vector/20250128/ourmid/pngtree-smiling-young-doctor-in-medical-uniform-and-stethoscope-png-image_15354017.png",
    },
    {
      name: "Dr. Ayşe Korkmaz",
      title: "Oral & Maxillofacial Surgeon",
      img: "https://png.pngtree.com/png-vector/20240612/ourmid/pngtree-women-doctor-picture-png-image_12725826.png",
    },
    {
      name: "Dr. Burak Şahin",
      title: "Periodontist",
      img: "https://png.pngtree.com/png-vector/20241115/ourmid/pngtree-handsome-male-doctor-posing-photo-smiling-png-image_14423112.png",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0B2A4A] text-[#EAF4FF] px-6 py-20 overflow-hidden">

      {/* SOL BORDO */}
      <div className="absolute top-0 left-0 h-full w-96 bg-gradient-to-r from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent z-0" />

      {/* SAĞ BORDO */}
      <div className="absolute top-0 right-0 h-full w-96 bg-gradient-to-l from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent z-0" />

      <div className="relative max-w-7xl mx-auto z-10">
        <h1 className="text-4xl font-bold mb-12 text-center">Our Doctors</h1>

        {/* GRID – DAHA DOLU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {doctors.map((doc, i) => (
            <div
              key={i}
              className="bg-[#0F3A5F] rounded-2xl p-8 flex flex-col items-center text-center
                         shadow-xl shadow-[#3B1F3F]/70 hover:shadow-[#3B1F3F]
                         transition w-80 mx-auto border-4 border-[#3B1F3F]"
            >
              {/* FOTO: BORDO DIŞ / MAVİ İÇ – BÜYÜK */}
              <div className="w-40 h-40 rounded-full bg-[#3B1F3F] flex items-center justify-center mb-5">
                <div className="w-32 h-32 rounded-full bg-[#0F3A5F] flex items-center justify-center">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-28 h-28 rounded-full object-cover scale-110"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold">{doc.name}</h2>
              <p className="text-[#CFE6F7] text-sm mt-2">{doc.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
