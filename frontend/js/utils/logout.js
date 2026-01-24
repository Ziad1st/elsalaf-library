import { API_URL } from "./API_URL.js";
import { smartFetch } from "./smartFetch.js";

export async function logout() {
  const response = await smartFetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.ok) {
    window.location.href = "home.html";
    localStorage.clear();
    return {
      success: true,
      ...(await response.json()),
    };
  }
  return {
    success: false,
    ...(await response.json()),
  };
}
