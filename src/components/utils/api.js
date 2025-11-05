import { API_BASE_URL } from "../../config";

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Token vencido o no válido
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP error ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("apiFetch error:", err.message);
    throw err;
  }
}
