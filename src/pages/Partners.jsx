const partners = [
  "TÜRK-SEN (Kıbrıs Türk İşçi Sendikaları Federasyonu)",
  "Aphrodite Village",
  "Arkın Group",
  "Asel Group",
  "Barış Kuvvetleri Komutanlığı (TSK)",
  "Başman Group of Companies",
  "BAY-SEN (BRTK Çalışanları Sendikası)",
  "Belediye Emekçileri Sendikası (BES)",
  "Casino İşletmecileri Birliği – CIB",
  "Cratos Premium Hotel Personel&Turist",
  "DEV-İŞ",
  "Dmg Group Personel&Turist",
  "Ermataş LTD",
  "K. Emekli Astsubaylar Derneği",
  "K. Emekli Subaylar Derneği",
  "Gümrük Çalışanları Sendikası",
  "Güvenlik Kuvvetleri Komutanlığı",
  "Kaner Group",
  "Kaya Artemis Resort Hotel",
  "Kemal Paralik Metal İşleri LTD",
  "Kıbrıs Türk Kamu Görevlileri Sendikası (KAMU-SEN)",
  "Kıbrıs Türk Öğretmenler Kooperatifi LTD",
  "Kıbrıs Türk Öğretmenler Yardımlaşma Kooperatifi (ÖYAK)",
  "Kıbrıs Türk Sanayi Odası",
  "Kıbrıs Vakıflar İdaresi",
  "KKTC Emekli Polisler Derneği",
  "Polis Genel Müdürlüğü",
  "Hür-İşçi Sendikaları Federasyonu",
  "Kıbrıs Türk Amme Memurları Sendikası (KTAMS)",
  "KKTCELL Personel",
];

export default function Partners() {
  return (
    <div className="relative min-h-screen bg-[#0B2A4A] text-[#EAF4FF] px-6 py-20 overflow-hidden">
      {/* Sol bordo dekor */}
      <div className="absolute top-0 left-0 h-full w-96 bg-gradient-to-r from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      {/* Sağ bordo dekor */}
      <div className="absolute top-0 right-0 h-full w-96 bg-gradient-to-l from-[#3B1F3F] via-[#0B2A4A]/95 to-transparent pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-10">
        <h1 className="text-4xl font-bold text-center mb-10">Our Partners & Insurance</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {partners.map((p, i) => (
            <div
              key={i}
              className="bg-[#0F3A5F] rounded-xl p-5 flex flex-col items-center text-center shadow-lg shadow-[#3B1F3F]/60 hover:shadow-[#3B1F3F]/80 transition border-4 border-[#3B1F3F] w-full"
            >
              <p className="text-[#CFE6F7] text-sm">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
