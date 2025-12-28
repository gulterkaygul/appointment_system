import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("doctor_token", res.data.access_token);
      navigate("/doctor/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B2A4A] relative">

      {/* Bordo yan efekt */}
      <div className="absolute left-0 top-0 h-full w-80 bg-gradient-to-r from-[#3B1F3F] to-transparent" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white rounded-2xl shadow-xl p-10 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#0B2A4A]">
          Doctor Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1F3F]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1F3F]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#3B1F3F] text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
