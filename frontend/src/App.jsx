console.log("APP RENDERED");

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorRoute from "./routes/DoctorRoute";
import AdminLayout from "./layouts/AdminLayout";
import AddAppointment from "./pages/admin/AddAppointment";
import ProtectedRoute from "./routes/ProtectedRoute";


// Public pages
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Corporate from "./pages/Corporate";
import Partners from "./pages/Partners";

// Login (TEK DOSYA – admin & doctor)
import Login from "./pages/Login";

// Doctor pages
import Dashboard from "./pages/doctor/Dashboard";
import MyAppointments from "./pages/doctor/MyAppointments";
import TodayAppointments from "./pages/doctor/TodayAppointments";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Patients from "./pages/admin/Patients";
import Appointments from "./pages/admin/Appointments";


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

        {/*  ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/*  ADMIN PANEL (NESTED + LAYOUT) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/new" element={<AddAppointment />} />
        </Route>

        {/*  DOCTOR LOGIN */}
        <Route path="/doctor/login" element={<Login />} />

        {/*  DOCTOR PANEL */}
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
