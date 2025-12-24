export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-[#7A1E2C]">
          Yakın Doğu Üniversitesi Diş Hastanesi
        </h1>

        <ul className="flex gap-6 text-sm font-medium text-gray-700">
          <li className="cursor-pointer hover:text-[#7A1E2C]">About</li>
          <li className="cursor-pointer hover:text-[#7A1E2C]">Clinics</li>
          <li className="cursor-pointer hover:text-[#7A1E2C]">Doctors</li>
          <li className="cursor-pointer hover:text-[#7A1E2C]">FAQ</li>
          <li className="cursor-pointer hover:text-[#7A1E2C]">Contact</li>
        </ul>
      </div>
    </nav>
  );
}
