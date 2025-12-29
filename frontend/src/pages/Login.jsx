import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);

      // 🔐 kaydet
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      // 🔁 yönlendir
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "doctor") navigate("/doctor");
      else navigate("/");
    } catch {
      setError("Email or password incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B2A4A] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#0F3A5F] p-8 rounded-2xl w-96 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <p className="bg-red-500/20 text-red-200 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#0A66C2] py-2 rounded-lg hover:bg-[#084C91] transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
