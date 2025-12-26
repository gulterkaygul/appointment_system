import { useState } from "react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    {
      title: "Corporate",
      content:
        "Near East University Dental Hospital provides modern and patient-centered oral healthcare services.",
    },
    {
      title: "Clinics",
      content:
        "We offer services such as dental examination, orthodontics, root canal treatment and cosmetic dentistry.",
    },
    {
      title: "Doctors",
      content:
        "Our experienced academic and clinical staff work with the latest dental technologies.",
    },
    {
      title: "FAQ",
      content:
        "You can find answers to frequently asked questions about appointments and treatments.",
    },
    {
      title: "Contact",
      content:
        "Phone: +90 XXX XXX XX XX — Email: info@neudent.com",
    },
  ];

  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <ul className="flex gap-8 text-sm font-medium text-gray-700">
          {menuItems.map((item, index) => (
            <li key={item.title} className="relative">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === index ? null : index)
                }
                className="hover:text-[#7A1E2C] transition"
              >
                {item.title}
              </button>

              {/* DROPDOWN */}
              {openMenu === index && (
                <div className="absolute left-0 mt-3 w-72 bg-white shadow-lg border rounded-lg p-4 z-50">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
