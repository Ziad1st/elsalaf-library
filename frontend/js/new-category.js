import { showAlert } from "./utils/alertModal.js";
import { API_URL } from "./utils/API_URL.js";
import { smartFetch } from "./utils/smartFetch.js";

const newCategoryForm = document.getElementById("newCategoryForm");

newCategoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookData = {
    name: document.getElementById("categoryName").value,
    order: document.getElementById("categoryOrder").value,
    description: document.getElementById("categoryDesc").value,
    categoryColor: document.getElementById("categoryColor").value,
  };

  try {
    const response = await smartFetch(`${API_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();

    if (!response.ok) {
      await showAlert(data.message, "", "error", null);
    }
    if (response.ok) {
      await showAlert(
        "تم اضافة القسم بنجاح",
        "",
        "success",
        "library-categories.html",
      );
      window.location.href = "library-categories.html";
    }
  } catch (error) {
    await showAlert(error.message || error, "", "error", null);

    console.error(error);
  }
});
