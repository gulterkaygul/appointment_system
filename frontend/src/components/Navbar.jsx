import { NavLink } from "react-router-dom";

export default function Navbar() {
  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Doctors", path: "/doctors" },
    { title: "Contact", path: "/contact" },
    { title: "Corporate", path: "/corporate" }, // Kurumsal sayfa
    { title: "Partners", path: "/partners" },   // Kurumlar / Sigortalar sayfa
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0A2540] via-[#0A3D66] to-[#0A66C2] shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex items-center gap-12 h-16 text-sm font-semibold tracking-wide">
          {menuItems.map((item) => (
            <li key={item.title} className="relative">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `pb-1 transition-all duration-300 ${
                    isActive
                      ? "text-white border-b-2 border-white"
                      : "text-white/80 hover:text-white hover:border-b-2 hover:border-white/60"
                  }`
                }
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </nav>
  );
}
