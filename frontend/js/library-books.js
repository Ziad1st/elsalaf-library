import {
  fetchBooksByCategory,
  fetchBooks,
  fetchBooksWithPagination,
  booksCount,
} from "./utils/fetchBooks.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
import { DomRenderHtml } from "./utils/DomRender.js";
loadingDataLayout("on", "جاري عرض كتب المكتبة...");

const booksCountEl = document.getElementById("booksCount");
const allBooksGrid = document.getElementById("allBooksGrid");

const categoryId = new URLSearchParams(window.location.search).get("category");
const searchValue = new URLSearchParams(window.location.search).get("search");

let currentBooksPage = 1;
const getBooks = async (page = currentBooksPage) => {
  loadingDataLayout("on", "جاري عرض كتب المكتبة...");
  let books;
  if (categoryId) {
    books = await fetchBooksWithPagination(page, 15, categoryId);
  } else if (searchValue) {
    books = await fetchBooksWithPagination(page, 15, null, null, searchValue);
  } else books = await fetchBooksWithPagination(page, 15);
  return books;
};

const bookCard = (book) => {
  console.log(book);
  return `<div book-id="${book._id}" class="group cursor-pointer">
            <div class="bg-white rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all duration-300 border border-[#e0dcd5]">
                
                <div style="width:fit-content;margin:0 auto;margin-bottom:10px"  class="relative h-52 overflow-hidden rounded-lg mb-3">
                    <img
                        loading="lazy" 
                        src="${book.cover || book.autoCover}" 
                        alt="${book.title}" 
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    >
                    <span class="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold" style="color: var(--accent);">
                        ${book.category ? book.category.name : "قسم الكتاب"}
                    </span>
                </div>

                <div class="text-right px-1">
                    <h3 class="font-bold text-xs mb-1 truncate" style="color: var(--primary);">
                        ${book.title}
                    </h3>
                    <p class="text-[10px] mb-2 truncate" style="color: var(--text-muted);">
                        ${book.author}
                    </p>
                    
                    <div class="flex items-center justify-between mt-auto">
                         <span class="text-[10px] font-bold" style="color: var(--accent);">
         ${book.views}
         <i class="fa-solid fa-eye text-xs"></i>
         </span>
                         <button class="text-[9px] px-2 py-1 rounded-md border hover:bg-gray-50 transition" style="border-color: var(--accent); color: var(--accent);">
                            تفاصيل
                         </button>
                    </div>
                </div>
            </div>
        </div>`;
};

const booksData = await getBooks();

const renderArrBooksToDom = async (BooksArr) => {
  BooksArr = BooksArr ? BooksArr : await booksData;
  allBooksGrid.innerHTML = DomRenderHtml("array", bookCard, BooksArr);
  booksCountEl.textContent = allBooksGrid.childElementCount;
      window.scrollTo(0, 0);
};
renderArrBooksToDom();

const paginationBtns = document.getElementById("pagination-btns");
const renderPaginationBtns = async (bookCount) => {
  const getBooksCount =
    categoryId || searchValue ? bookCount : await booksCount();
  paginationBtns.innerHTML = "";
  for (let i = 1; i <= Math.ceil(getBooksCount / 15); i++) {
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

renderPaginationBtns(await booksData.length);

paginationBtns.addEventListener("click", async (e) => {
  const page = e.target.innerText || null;
  const limit = 15;
  if (page) {
    loadingDataLayout("on", "جاري عرض الكتب...");
    const books = await getBooks(page);
    renderArrBooksToDom(books);
    loadingDataLayout("off");
  }
  paginationBtns.querySelectorAll("button").forEach((btn) => {
    btn.className =
      "p-2 w-8 h-8 rounded-lg border bg-white text-slate-600 hover:bg-slate-100";
    btn.disabled = false;

    if (btn.innerText == page) {
      btn.disabled = true;
      btn.className =
        "p-2 w-8 h-8 rounded-lg border bg-[#8e735b] text-white hover:bg-[#7a624d]";
    }
  });
});

window.addEventListener("click", async (e) => {
  const card = e.target.closest(".group");

  const bookId = card?.getAttribute("book-id");
  if (card && bookId) {
    const book = (await booksData).find(
      (book) => book._id.trim() === bookId.trim(),
    );
    localStorage.setItem("book", JSON.stringify(book));
    console.log(book);
    window.location.href = "book-details.html?id=" + bookId;
  }
});
window.onload = loadingDataLayout("off");

