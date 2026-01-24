import { API_URL } from "./utils/API_URL.js";
import { DomRenderHtml } from "./utils/DomRender.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
import { booksCount } from "./utils/fetchBooks.js";
import { fetchUsersCount } from "./utils/usersFetchs.js";

loadingDataLayout("on", "جاري تحميل الكتب...");
document.querySelector(".libraryBooksCount").textContent =
  `${await booksCount()}`;
document.querySelector(".libraryUsersCount").textContent =
  `${await fetchUsersCount()}`;

const fetchBooks = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

const pageBooks = await fetchBooks("api/books/moreViews");
const sliderBooks = (await pageBooks)
  .sort((a, b) => b.views - a.views)
  .slice(0, 20);

const slideCard = (book) => {
  return `<div book-id="${
    book._id
  }" class="w-44 md:w-52 flex-shrink-0 group cursor-pointer">
  <div class="h-full bg-white rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all duration-300 border border-[#e0dcd5] flex flex-col">
        
    <div style="width:fit-content;margin:0 auto;margin-bottom:10px" class="relative w-full h-56 overflow-hidden rounded-lg mb-3 bg-gray-50"> <img
        loading="lazy" 
        src="${book.cover || book.autoCover}" 
        alt="${book.title}" 
        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
      > <span class="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold" style="color: var(--accent);">
        ${book.category ? book.category.name : "قسم الكتاب"}
      </span>
    </div>

    <div class="text-right px-1 flex flex-col flex-grow">
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
document.getElementById("sliderContainer").innerHTML = DomRenderHtml(
  "array",
  slideCard,
  sliderBooks,
);

//    -----------   -----------   -----------  RENDER ALL BOOKS   -----------   -----------   -----------

const bookCard = (book) => {
  console.log(book);
  return book
    ? `<div book-id="${book?._id}" class="group cursor-pointer">
            <div class="bg-white rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all duration-300 border border-[#e0dcd5]">
                
                <div style="width:fit-content;margin:0 auto;margin-bottom:10px"  class="relative h-52 overflow-hidden rounded-lg mb-3">
                    ${
                      book?.cover || book?.autoCover
                        ? `<img
                        loading="lazy" 
                        src="${book?.cover || book?.autoCover}" 
                        alt="${book?.title}" 
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    >`
                        : `<div class="empty-state-container text-center py-10">
    <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="200" fill="none"/>
      <path d="M200 60C167.317 60 140 87.317 140 120H120C120 76.88 155.88 40 200 40C244.12 40 280 76.88 280 120H260C260 87.317 232.683 60 200 60Z" fill="#E0E7EB"/>
      <path d="M200 60C167.317 60 140 87.317 140 120H120C120 76.88 155.88 40 200 40C244.12 40 280 76.88 280 120H260C260 87.317 232.683 60 200 60Z" fill="#B0BEC5"/>
      <path d="M120 120H280V160H120V120Z" fill="#CFD8DC"/>
      <path d="M120 120H280V160H120V120Z" fill="#B0BEC5"/>
      <path d="M200 60C167.317 60 140 87.317 140 120V160H200V60ZM200 60V160H260V120C260 87.317 232.683 60 200 60Z" fill="#90A4AE"/>
      <text x="200" y="180" font-family="Arial, sans-serif" font-size="24" fill="#607D8B" text-anchor="middle" dominant-baseline="middle">
        لا توجد كتب
      </text>
    </svg>
    <p class="text-gray-500 mt-4">يبدو أن هذا القسم فارغ حالياً.</p>
</div>`
                    }
                    <span class="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold" style="color: var(--accent);">
                        ${book?.category ? book?.category.name : "قسم الكتاب"}
                    </span>
                </div>

                <div class="text-right px-1">
                    <h3 class="font-bold text-xs mb-1 truncate" style="color: var(--primary);">
                        ${book?.title}
                    </h3>
                    <p class="text-[10px] mb-2 truncate" style="color: var(--text-muted);">
                        ${book?.author}
                    </p>
                    
                    <div class="flex items-center justify-between mt-auto">
                         <span class="text-[10px] font-bold" style="color: var(--accent);">
         ${book?.views}
         <i class="fa-solid fa-eye text-xs"></i>
         </span>
                         <button class="text-[9px] px-2 py-1 rounded-md border hover:bg-gray-50 transition" style="border-color: var(--accent); color: var(--accent);">
                            تفاصيل
                         </button>
                    </div>
                </div>
            </div>
        </div>`
    : `
        <div class="empty-state-container text-center py-10">
        <p>لا توجد كتب</p>
    </div>
    `;
};

const getRandomBooks = (numberOfRandBooks = 15) => {
  if (!pageBooks || pageBooks.length === 0) return [];

  const shuffled = [...pageBooks].sort(() => Math.random() - 0.5);

  const randomBooks = shuffled.slice(0, numberOfRandBooks);

  return randomBooks.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

document.getElementById("allBooksGrid").innerHTML = DomRenderHtml(
  "array",
  bookCard,
  getRandomBooks(),
);

window.onload = loadingDataLayout("off");

//  -----------   -----------   -----------  WINDOW CLICK EVENT  -----------   -----------

window.addEventListener("click", (e) => {
  const card = e.target?.closest(".group");
  const bookId = card?.getAttribute("book-id");
  if (card && bookId) {
    const book = pageBooks.find((book) => book._id === bookId);
    localStorage.setItem("book", JSON.stringify(book));
    console.log(book);
    window.location.href = "book-details.html?id=" + bookId;
  }
});
const sliderBtnsActions = () => {
  const container = document.getElementById("sliderContainer");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (!container || !nextBtn || !prevBtn) return;

  // دالة لحساب المسافة بدقة في كل ضغطة
  const getScrollAmount = () => {
    const item = container.children[0];
    const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
    return item.offsetWidth + gap;
  };

  // وظيفة التحريك الانسيابي
  const scroll = (direction) => {
    const amount = getScrollAmount();
    container.scrollBy({
      left: direction === "next" ? -amount : amount, // السالب لليمين في RTL
      behavior: "smooth",
    });
  };

  // إزالة المستمعات القديمة (اختياري لو كانت الدالة ستعرف خارجياً)
  // والأفضل: ربط الأحداث مرة واحدة فقط خارج الدالة
  nextBtn.onclick = () => scroll("next");
  prevBtn.onclick = () => scroll("prev");
};

// تشغيل الدالة مرة واحدة فقط
sliderBtnsActions();
