export default function Header() {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-4">
        {/* Logo artık public klasöründen geliyor */}
        <img src="/logo.png" alt="Logo" className="w-14 h-auto" />
        <div>
          <h1 className="text-lg font-bold text-[#7A1E2C]">
            Yakın Doğu Üniversitesi Diş Hastanesi
          </h1>
          <p className="text-sm text-gray-500">
            Healthy teeth, beautiful smiles
          </p>
        </div>
      </div>
    </header>
  );
}
