import {
  fetchBooksWithPagination,
  booksCount,
  fetchBooksByCategory,
} from "./utils/fetchBooks.js";
import { API_URL } from "./utils/API_URL.js";
import { countOfBooksAddedByUser } from "./utils/protectedFetchs.js";
import { DomRenderHtml } from "./utils/DomRender.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
import { smartFetch } from "./utils/smartFetch.js";
import { fetchCategories } from "./utils/fetchCategories.js";
import { confirmModal } from "./utils/confirmModal.js";
let books;
loadingDataLayout("on", "جاري تحميل الكتب...");
const windowUrlParams = new URLSearchParams(window.location.search);
const userIdWhoAddBooksParam = windowUrlParams.get("user");
//>> S render books
const formatingDate = (date) =>
  new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const renderPaginatedBooks = (books) => {
  const bookCard = (book) => {
    return `
            <tr book-id="${book.id}" class="hover:bg-slate-50 transition-all">
                <td class="p-6 flex items-center gap-4">
                  <div class="group cursor-pointer goToBook relative flex items-center shrink-0">
                    <div class="w-12 h-16 cursor-pointer bg-white hover:bg-slate-50 rounded-lg flex items-center justify-center text-[#8e735b] border border-slate-200 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-[#8e735b]/30">
                      <i class="fa-solid fa-book-bookmark text-xl transition-transform duration-300 group-hover:scale-110"></i>
                    </div>

                    <div class="absolute right-full mr-3 flex items-center pointer-events-none opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      <div class="w-2 h-2 bg-[#1b2559] rotate-45 -ml-1"></div>
                      <div class="bg-[#1b2559] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap">
                        الذهاب للكتاب
                        <i class="fa-solid fa-arrow-left animate-pulse"></i>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p class="font-black text-[#1b2559] text-[12px] font-bold mb-1">
                     ${book.title}
                    </p>
                    <p class="text-[10px] text-slate-400">${book.author}</p>
                  </div>
                </td>
                <td class="p-6">
                  <span class="bg-blue-50 text-blue-500 px-3 py-1 rounded-lg text-[10px] font-black italic">${
                    book.category.name
                  }</span>
                </td>
                <td class="p-6 text-xs text-slate-500 font-bold">${formatingDate(
                  book.createdAt,
                )}</td>
                <td class="p-6">
                  <div class="flex justify-center gap-2">
                    <button class="editBtn w-9 h-9 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                      <i class="editBtn fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="removeBtn w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <i class="removeBtn fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>`;
  };
  document.getElementById("booksTableBody").innerHTML = DomRenderHtml(
    "array as table",
    bookCard,
    books,
  );
};
let getBooksCount = await booksCount();
const paginationBtns = document.getElementById("pagination-btns");
const renderPaginationBtns = async (bookCount) => {
  getBooksCount = bookCount
    ? bookCount
    : userIdWhoAddBooksParam
      ? await countOfBooksAddedByUser(userIdWhoAddBooksParam)
      : await booksCount();
  paginationBtns.innerHTML = "";
  for (let i = 1; i <= Math.ceil(getBooksCount / 5); i++) {
    paginationBtns.innerHTML += `
        <button
        ${
          i === 1
            ? "class='p-2 w-8 h-8 rounded-lg border bg-[#8e735b] text-white'"
            : "class='p-2 w-8 h-8 rounded-lg border bg-white text-slate-600 hover:bg-slate-100'"
        } class="p-2 w-8 h-8 rounded-lg border bg-white text-slate-600 hover:bg-slate-100"
              >
                ${i}
                
              </button>
  `;
  }
};
let currentPage = 1;

const pagination = async (page, limit) => {
  books = userIdWhoAddBooksParam
    ? await fetchBooksWithPagination(page, limit, null, userIdWhoAddBooksParam)
    : await fetchBooksWithPagination(page, limit);
  renderPaginatedBooks(books);

  currentPage = page;

  paginationBtns.querySelectorAll("button").forEach((btn) => {
    btn.className =
      "p-2 w-8 h-8 rounded-lg border bg-white text-slate-600 hover:bg-slate-100";
    if (btn.innerText == page) {
      btn.className = "p-2 w-8 h-8 rounded-lg border bg-[#8e735b] text-white";
    }
  });
  loadingDataLayout("off");
};
pagination(currentPage, 5);
if (!userIdWhoAddBooksParam) {
  renderPaginationBtns();
} else {
  const countOfBooks = await countOfBooksAddedByUser(userIdWhoAddBooksParam);
  renderPaginationBtns(countOfBooks);
}

paginationBtns.addEventListener("click", async (e) => {
  const page = e.target.innerText || null;
  const limit = 5;
  if (page) {
    loadingDataLayout("on", "جاري تحميل الكتب...");
    pagination(page, limit);
  }
});

document
  .querySelectorAll(".allBooksCount")
  .forEach(async (e) => (e.textContent = await getBooksCount));

//>> E render books

//>> S render categories

const categoryFilter = document.getElementById("categoryFilter");
const categories = await fetchCategories();
categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category.id;
  option.textContent = category.name;
  categoryFilter.appendChild(option);
});

//>> E render categories

//>> S filter books
const fetchBooksWithCategory = async (categoryId) => {
  const books = await fetchBooksByCategory(categoryId);
  renderPaginatedBooks(books);
  renderPaginationBtns(books.length);
};
categoryFilter.addEventListener("change", async (e) => {
  const categoryId = e.target.value;
  if (categoryId) {
    console.log(categoryId);
    await fetchBooksWithCategory(categoryId);
  } else {
    pagination(currentPage, 5);
    renderPaginationBtns();
  }
});
//>> E filter books

//>> S handle actions

const removeBook = (bookId) => {
  smartFetch(`${API_URL}/api/books/${bookId}`, {
    method: "DELETE",
  }).then(() => {
    pagination(currentPage, 5);
    renderPaginationBtns();
  });
};

window.onclick = async (e) => {
  const elClicked = e.target;
  const compareClass = (className) => elClicked.classList.contains(className);

  if (compareClass("editBtn")) {
    window.location.href = `edit-book.html?id=${elClicked
      .closest("tr")
      .getAttribute("book-id")}`;
  }
  if (compareClass("removeBtn")) {
    const bookId = elClicked.closest("tr").getAttribute("book-id");
    const confirmation = await confirmModal(
      "متأكد من حذف هذا الكتاب من المكتبة؟",
      "تأكيد الحذف",
    );
    if (confirmation) {
      removeBook(bookId);
    }
  }
  if (elClicked.closest(".goToBook")) {
    const bookId = elClicked.closest("tr").getAttribute("book-id");
    const book = books.find((book) => book._id === bookId);
    localStorage.setItem("book", JSON.stringify(book));
    window.location.href = `book-details.html?id=${bookId}`;
  }
};

window.onload = loadingDataLayout("off");

//>> E handle actions

//>> S search books
const bookSearchInput = document.getElementById("bookSearch");
bookSearchInput.addEventListener("keyup", async (e) => {
  const searchValue = e.target.value;
  if (searchValue) {
    if (e.key === "Enter") {
      const filteredBooks = await fetchBooksWithPagination(
        1,
        15,
        null,
        null,
        searchValue,
      );
      renderPaginatedBooks(filteredBooks);
      renderPaginationBtns(filteredBooks.length);
    }
  } else {
    pagination(currentPage, 5);
    renderPaginationBtns();
  }
});
//>> E search books
