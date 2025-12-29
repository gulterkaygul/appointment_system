import BASE_URL, { authHeader } from "../api";

export async function getPatients() {
  const res = await fetch(`${BASE_URL}/patients`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function createPatient(data) {
  const res = await fetch(`${BASE_URL}/patients`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePatient(id) {
  return fetch(`${BASE_URL}/patients/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}
