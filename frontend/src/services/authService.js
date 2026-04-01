import api from "./api";

// 🔐 LOGIN
export async function login(email, password) {
  const res = await api.post("/auth/login", {
    email,
    password,
  });
  return res.data;
}

// 🔓 LOGOUT (ileride kullanırsın)
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export const resetPassword = async (token, newPassword) => {
  const res = await fetch("http://127.0.0.1:8000/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      new_password: newPassword,
    }),
  });

  if (!res.ok) {
    throw new Error("Reset password failed");
  }

  return res.json();
};