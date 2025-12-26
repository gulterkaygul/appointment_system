export default function Corporate() {
  const sections = [
    {
      title: "About Our Hospital",
      text: `Near East University Faculty of Dentistry Hospital is a signature of excellence, leadership, and pioneering in all fields. Established in 1988, it became the first dental faculty hospital accredited by Joint Commission International (JCI), delivering unmatched quality and advanced technology services.`,
    },
    {
      title: "Our Mission",
      text: `Our electronic hospital system (“E-Hospital”) ensures efficient patient care. With patient-focused solutions, our clinics provide dental science and artistry at the highest level. We cater to international dental health tourism with multilingual support through our International Patient Coordination Center. Near East University continues its tradition of excellence across the dental health sector.`,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0B2A4A] text-[#EAF4FF] px-6 py-20 overflow-hidden">
      {/* Sol bordo dekor */}
      <div className="absolute top-0 left-0 h-full w-96 bg-gradient-to-r from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      {/* Sağ bordo dekor */}
      <div className="absolute top-0 right-0 h-full w-96 bg-gradient-to-l from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        <h1 className="text-4xl font-bold text-center mb-10">Corporate Information</h1>

        <div className="grid md:grid-cols-2 gap-8 justify-center">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-[#0F3A5F] rounded-xl p-6 flex flex-col items-center text-center shadow-lg shadow-[#3B1F3F]/60 hover:shadow-[#3B1F3F]/80 transition border-4 border-[#3B1F3F] w-full"
            >
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="text-[#CFE6F7] text-sm">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
