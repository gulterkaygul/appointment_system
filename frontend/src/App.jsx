console.log("APP RENDERED");

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorRoute from "./routes/DoctorRoute";

// Public pages 
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Corporate from "./pages/Corporate";
import Partners from "./pages/Partners";

// Doctor pages
import DoctorLogin from "./pages/doctor/Login";
import Dashboard from "./pages/doctor/Dashboard";
import MyAppointments from "./pages/doctor/MyAppointments";
import TodayAppointments from "./pages/doctor/TodayAppointments";

// 🔐 ADMIN
import Login from "./pages/Login"; // admin login
import AdminDashboard from "./pages/admin/AdminDashboard";
import Patients from "./pages/admin/Patients";
import Appointments from "./pages/admin/Appointments";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC WEBSITE (Navbar VAR) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/partners" element={<Partners />} />
        </Route>

        {/* 🔐 ADMIN LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute role="admin">
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="admin">
              <Appointments />
            </ProtectedRoute>
          }
        />

        {/* 👨‍⚕️ DOCTOR LOGIN */}
        <Route path="/doctor/login" element={<DoctorLogin />} />

        {/* 👨‍⚕️ DOCTOR PANEL */}
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
