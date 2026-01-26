const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");
import { API_URL } from "../js/utils/API_URL.js";
import { smartFetch } from "../js/utils/smartFetch.js";
import { loadingDataLayout } from "../js/utils/loadingDataLayout.js";
import { DomRenderHtml } from "../js/utils/DomRender.js";
import { fetchCategories } from "../js/utils/fetchCategories.js";
import { showAlert } from "./utils/alertModal.js";

const editBookForm = document.getElementById("editBookForm");

const formInputs = {
  title: document.getElementById("title"),
  author: document.getElementById("author"),
  description: document.getElementById("description"),
  deathYear: document.getElementById("deathYear"),
  pages: document.getElementById("pages"),
  pdfLink: document.getElementById("pdfLink"),
  publisher: document.getElementById("publisher"),
  coverLink: document.getElementById("coverLink"),
  category: document.getElementById("category"),
};
// 1. جلب البيانات ووضعها في الـ Form
async function loadBookData() {
  const response = await fetch(`${API_URL}/api/books/${bookId}`);
  const data = await response.json();
  console.log(data);

  formInputs.title.value = data.book.title;
  formInputs.author.value = data.book.author;
  formInputs.description.value = data.book.description;
  formInputs.deathYear.value = data.book.authorDeathYear;
  formInputs.pages.value = data.book.pagesNumber;
  formInputs.pdfLink.value = data.book.pdfUrl;
  ((formInputs.publisher.value = data.book.publisher),
    (formInputs.coverLink.value = data.book.cover || ""),
    (document.getElementById("bookOldTitle").innerText =
      `تعديل كتاب: ${data.book.title}`));

  const categoryOption = (category) =>
    `<option ${
      category.id === data.book.category.id ? "selected" : ""
    } value="${category.id}">${category.name}</option>`;

  const categories = await fetchCategories();
  document.getElementById("category").innerHTML = DomRenderHtml(
    "array",
    categoryOption,
    categories,
  );
  formInputs.category.value = data.book.category.id;
}

if (bookId) loadBookData();

// 2. تحديث البيانات عند الحفظ

editBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // هنا نستخدم axios.put أو fetch مع method: 'PUT'
  loadingDataLayout("on", "جاري تحديث بيانات الكتاب...");
  const bookData = {
    title: formInputs.title.value,
    author: formInputs.author.value,
    category: formInputs.category.value,
    authorDeathYear: formInputs.deathYear.value,
    pagesNumber: formInputs.pages.value,
    description: formInputs.description.value,
    pdfUrl: formInputs.pdfLink.value,
    cover: formInputs.coverLink.value,
    publisher: formInputs.publisher.value,
  };
  const response = await smartFetch(`${API_URL}/api/books/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });
  const data = await response.json();
  loadingDataLayout("off");
  if (response.ok) {
    await showAlert("تم تعديل الكتاب بنجاح", "", "success", "admin-books.html");
  }
});

