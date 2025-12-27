import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Corporate from "./pages/Corporate";
import Partners from "./pages/Partners";

import DoctorRoute from "./routes/DoctorRoute";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorLogin from "./pages/doctor/Login";
import Dashboard from "./pages/doctor/Dashboard";
import MyAppointments from "./pages/doctor/MyAppointments";
import TodayAppointments from "./pages/doctor/TodayAppointments";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ---------- PUBLIC PAGES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/partners" element={<Partners />} />

        {/* ---------- DOCTOR AUTH ---------- */}
        <Route path="/doctor/login" element={<DoctorLogin />} />

        {/* ---------- DOCTOR PANEL (LAYOUT) ---------- */}
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <DoctorLayout />
            </DoctorRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="today" element={<TodayAppointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
