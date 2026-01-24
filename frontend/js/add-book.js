const addBookForm = document.getElementById("add-book-form");
import { smartFetch } from "./utils/smartFetch.js";
import { API_URL } from "./utils/API_URL.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
import { fetchCategories } from "./utils/fetchCategories.js";
import { DomRenderHtml } from "./utils/DomRender.js";
import { showAlert } from "./utils/alertModal.js";

loadingDataLayout("on", "جاري تحميل تصنيفات الكتب...");
const categories = await fetchCategories();
const categoryOption = (data) =>
  `<option value="${data.id}">${data.name}</option>`;
document.getElementById("category").innerHTML = DomRenderHtml(
  "array",
  categoryOption,
  categories,
);

window.onload = loadingDataLayout("off");

addBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookData = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    category: document.getElementById("category").value,
    authorDeathYear: document.getElementById("authorDeathYear").value,
    pagesNumber: document.getElementById("pagesNumber").value,
    description: document.getElementById("description").value,
    pdfUrl: document.getElementById("pdfUrl").value,
    cover: document.getElementById("coverImage").value,
    publisher: document.getElementById("publisher").value,
  };

  console.log(bookData);

  try {
    const response = await smartFetch(`${API_URL}/api/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      await showAlert(
        "تم اضافة الكتاب بنجاح",
        "تم اضافة الكتاب بنجاح",
        "success",
        "home.html",
      );
    } else {
      await showAlert("حدث خطأ", data.message, "error", null);
    }
  } catch (err) {
    console.error(err);
    await showAlert("حدث خطأ", err.message, "error", null);
  }
});
