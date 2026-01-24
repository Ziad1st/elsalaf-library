import { showAlert } from "./utils/alertModal.js";
import { API_URL } from "./utils/API_URL.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
loadingDataLayout("on", "جاري تحميل بيانات الكتاب...");
const bookDetailtsEls = {
  bookCover: document.getElementById("book-cover"),
  downloadBtn: document.getElementById("download-btn"),
  bookTitle: document.getElementById("book-title"),
  bookAuthor: document.getElementById("book-author"),
  authorDeathBadge: document.getElementById("author-death-badge"),
  bookRate: document.getElementById("book-rate"),
  bookViews: document.getElementById("book-views"),
  bookPages: document.getElementById("book-pages"),
  bookDownloads: document.getElementById("book-downloads"),
  bookDescription: document.getElementById("book-description"),
  bookPublisher: document.getElementById("book-publisher"),
  bookCategory: document.getElementById("book-category"),
  bookCategoryTag: document.getElementById("book-category-tag"),
  bookCreatedAt: document.getElementById("book-created-at"),
};

const bookPopup = document.getElementById("bookPopup");
const popupLoader = document.getElementById("popupLoader");
const archiveIframe = document.getElementById("archiveIframe");

const togglePopup = () => bookPopup.classList.toggle("hidden");

const loader = document.getElementById("loader");
const frameLoader = document.getElementById("frame-loader");

let bookData = localStorage.getItem("book");
if (bookData != "undefined") bookData = JSON.parse(bookData);
if (
  !bookData ||
  bookData == undefined ||
  !window.location.search.split("?id=")[1] ||
  window.location.search.split("?id=")[1] !== bookData._id
) {
  await showAlert("هذه الكتاب غير موجودة", "", "error", null);
  window.location.href = "home.html";
}

function renderBookDetails() {
  bookData = JSON.parse(localStorage.getItem("book"));

  bookDetailtsEls.bookCover.src = bookData.cover || bookData.autoCover;
  bookDetailtsEls.downloadBtn.href = bookData.pdfUrl;
  bookDetailtsEls.bookTitle.textContent = bookData.title;
  bookDetailtsEls.bookAuthor.textContent = bookData.author;
  bookDetailtsEls.authorDeathBadge.textContent = bookData.authorDeathYear;
  bookDetailtsEls.bookRate.textContent = bookData.rate;
  bookDetailtsEls.bookViews.textContent = bookData.views;
  bookDetailtsEls.bookPages.textContent = bookData.pagesNumber;
  bookDetailtsEls.bookDownloads.textContent = bookData.downloadCount;
  bookDetailtsEls.bookDescription.textContent = bookData.description;
  bookDetailtsEls.bookPublisher.textContent = bookData.publisher;
  bookDetailtsEls.bookCategory.textContent = bookData.category.name;
  bookDetailtsEls.bookCategoryTag.textContent = bookData.category.name;
  bookDetailtsEls.bookCreatedAt.textContent = new Date(
    bookData.createdAt,
  ).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    renderBookDetails();
    loadingDataLayout("off");
    setTimeout(() => {
      loader.style.display = "none";
      document.getElementById("book-details").classList.remove("hidden");
    }, 400);
  }, 1000);
});

const openPopup = () => {
  togglePopup();
  archiveIframe.src = bookData.pdfUrl;
};

const closePopup = () => {
  popupLoader.classList.remove("hidden");
  renderBookDetails();

  togglePopup();
  archiveIframe.src = "";
  archiveIframe.classList.add("opacity-0");
  archiveIframe.classList.remove("opacity-100");
};

window.addEventListener("click", (e) => {
  const elClicked = e.target;
  if (elClicked.classList.contains("close-popup")) {
    closePopup();
  }
  if (elClicked.classList.contains("open-popup")) openPopup();
});

archiveIframe.onload = function () {
  popupLoader.classList.remove("hidden");

  setTimeout(() => {
    archiveIframe.classList.remove("opacity-0");
    archiveIframe.classList.add("opacity-100");
    popupLoader.classList.add("hidden");
  }, 1000);
};

const readFromArchiveBtn = document.getElementById("read-from-archive");
const downloadBookBtn = document.getElementById("download-btn");

const updateBookViewsInDB = async () => {
  try {
    await fetch(
      `${API_URL}/api/books/updateDataByUserActions/${bookData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ views: bookData.views + 1 }),
      },
    );
  } catch (error) {
    console.log(error);
  }
};

const updateBookDownloadsInDB = async () => {
  try {
    await fetch(
      `${API_URL}/api/books/updateDataByUserActions/${bookData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ downloadCount: bookData.downloadCount + 1 }),
      },
    );
  } catch (error) {
    console.log(error);
  }
};

readFromArchiveBtn.addEventListener("click", async () => {
  await updateBookViewsInDB();
  localStorage.setItem(
    "book",
    JSON.stringify({ ...bookData, views: bookData.views + 1 }),
  );
});

downloadBookBtn.addEventListener("click", async () => {
  await updateBookDownloadsInDB();
  localStorage.setItem(
    "book",
    JSON.stringify({ ...bookData, downloadCount: bookData.downloadCount + 1 }),
  );
  bookData = JSON.parse(localStorage.getItem("book"));
  bookDetailtsEls.bookDownloads.textContent = bookData.downloadCount;
});
