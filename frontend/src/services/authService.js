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
