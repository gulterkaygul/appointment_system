import BASE_URL, { authHeader } from "../api";

export async function getAllAppointments() {
  const res = await fetch(`${BASE_URL}/appointments`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function updateAppointment(id, status) {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteAppointment(id) {
  return fetch(`${BASE_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}
