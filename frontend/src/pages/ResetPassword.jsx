import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async () => {
    try {
      await resetPassword(token, password);
      setMessage("Password updated successfully ✅");
    } catch (err) {
      setMessage("Error resetting password ❌");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-xl mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4"
      />

      <button onClick={handleReset} className="bg-blue-500 text-white px-4 py-2">
        Reset Password
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}