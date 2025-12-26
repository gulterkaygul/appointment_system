export default function Doctors() {
  const doctors = [
    { name: "Dr. Canan Demir", title: "Orthodontist", img: "https://via.placeholder.com/150" },
    { name: "Dr. Ahmet Yıldız", title: "Endodontist", img: "https://via.placeholder.com/150" },
    { name: "Dr. Elif Demir", title: "Pediatric Dentist", img: "https://via.placeholder.com/150" },
    { name: "Dr. Mehmet Kaya", title: "Prosthodontist", img: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0B2A4A] text-[#EAF4FF] px-6 py-20 overflow-hidden">
      
      {/* Sol kenar bordomsi dekoru (daha geniş & yoğun) */}
      <div className="absolute top-0 left-0 h-full w-96 bg-gradient-to-r from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      {/* Sağ kenar bordomsi dekoru (daha geniş & yoğun) */}
      <div className="absolute top-0 right-0 h-full w-96 bg-gradient-to-l from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      {/* Sayfa içeriği (üstte kalacak) */}
      <div className="relative max-w-7xl mx-auto z-10">
        <h1 className="text-4xl font-bold mb-10 text-center">Our Doctors</h1>

        {/* Kart grid (3’lü satır) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {doctors.map((doc, i) => (
            <div
              key={i}
              className="bg-[#0F3A5F] rounded-xl p-5 flex flex-col items-center text-center shadow-lg shadow-[#3B1F3F]/60 hover:shadow-[#3B1F3F]/80 transition w-64 mx-auto border-4 border-[#3B1F3F]"
            >
              <img
                src={doc.img}
                alt={doc.name}
                className="w-28 h-28 rounded-full mb-3 object-cover border-4 border-[#0A66C2]"
              />
              <h2 className="text-lg font-semibold">{doc.name}</h2>
              <p className="text-[#CFE6F7] text-sm">{doc.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
