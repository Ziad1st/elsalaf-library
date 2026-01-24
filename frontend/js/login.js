import { showAlert } from "./utils/alertModal.js";
import { API_URL } from "./utils/API_URL.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    await showAlert(
      "يرجى ادخال البريد الالكتروني و كلمة المرور",
      "",
      "error",
      null,
    );
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
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
    console.error(error.message);
    await showAlert(error.message || error, "", "error", null);
  }
});
