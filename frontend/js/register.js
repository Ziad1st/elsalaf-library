import { showAlert } from "./utils/alertModal.js";
import { API_URL } from "./utils/API_URL.js";

const registerForm = document.getElementById("register-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const roleIsPublisher = document.getElementById("isPublisher").checked;

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role: roleIsPublisher ? "publisher" : "user",
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      window.location.href = "home.html";
    } else {
      await showAlert(data.message, "", "error", null);
    }
  } catch (error) {
    console.error(error);
    await showAlert(error.message || error, "", "error", null);
  }
});
