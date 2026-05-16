import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import AdminLayout from "./layouts/AdminLayout";

// Routes & Protection
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Corporate from "./pages/Corporate";
import Partners from "./pages/Partners";
import ResetPassword from "./pages/ResetPassword";

// Login
import Login from "./pages/Login";

// Doctor pages
import Dashboard from "./pages/doctor/Dashboard";
import MyAppointments from "./pages/doctor/MyAppointments";
import TodayAppointments from "./pages/doctor/TodayAppointments";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Patients from "./pages/admin/Patients";
import Appointments from "./pages/admin/Appointments";
import AddAppointment from "./pages/admin/AddAppointment";

// Patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";

// Chatbot Component - Yeni eklendi
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 🌐 PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🔑 LOGIN ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/doctor/login" element={<Login />} />
        <Route path="/patient/login" element={<Login />} />

        {/* 🛡️ ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/new" element={<AddAppointment />} />
        </Route>

        {/* 🛡️ DOCTOR PANEL */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="today" element={<TodayAppointments />} />
        </Route>

        {/* 🛡️ PATIENT PANEL */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              {/* Patient için bir Layout varsa buraya ekleyebilirsin */}
              <PatientDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
        </Route>

        {/* 404 - Tanımsız yollar */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {/* Chatbot her zaman en üstte ve her sayfada görünür */}
      <ChatWidget />
    </BrowserRouter>
  );
}