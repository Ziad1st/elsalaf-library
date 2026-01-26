import { showAlert } from "./utils/alertModal.js";
import { fetchCategories } from "./utils/fetchCategories.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
import { fetchCreateOneBook } from "./utils/protectedFetchs.js";

const dummyJson = [
  {
    title: "كتاب التوحيد",
    author: "الإمام محمد بن عبد الوهاب",
    description:
      "كتاب التوحيد هو من أهم الكتب في الإسلام، حيث يتناول عقيدة المسلمين ومبادئ الإيمان والتوحيد.",
    pdfUrl: "https://example.com/tawhid.pdf",
    pagesNumber: "200",
    publisher: "دار العلم للنشر",
    authorDeathYear: "1206",
  },
  {
    title: "كتاب الإيمان",
    author: "الإمام محمد بن عبد الوهاب",
    description:
      "كتاب الإيمان هو من أهم الكتب في الإسلام، حيث يتناول عقيدة المسلمين ومبادئ الإيمان والتوحيد.",
    pdfUrl: "https://example.com/iman.pdf",
    pagesNumber: "200",
    publisher: "دار العلم للنشر",
    authorDeathYear: "1206",
  },
  {
    title: "كتاب الفقه",
    author: "الإمام محمد بن عبد الوهاب",
    description:
      "كتاب الفقه هو من أهم الكتب في الإسلام، حيث يتناول عقيدة المسلمين ومبادئ الإيمان والتوحيد.",
    pdfUrl: "https://example.com/fiqh.pdf",
    pagesNumber: "200",
    publisher: "دار العلم للنشر",
    authorDeathYear: "1206",
  },
];

const jsonInput = document.getElementById("jsonInput");

const validateBtn = document.getElementById("validateBtn");
const categories = await fetchCategories();
let booksJson = jsonInput.value;

const checkBookRequiredData = (books) => {
  // Check if all required fields are present
  let res = "";
  books.forEach((book) => {
    if (
      book.title &&
      book.author &&
      book.description &&
      book.pdfUrl &&
      book.pagesNumber &&
      book.publisher &&
      book.authorDeathYear
    ) {
      res += "✅";
    } else {
      res += "❌";
    }
  });
  return res.includes("❌") ? false : true;
};

const bookCard = (book) => `<div
                class="flex flex-col md:flex-row md:items-center justify-between gap-4 my-[5px]"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-[#8e735b]/10 text-[#8e735b] rounded-xl flex items-center justify-center"
                  >
                    <i class="fa-solid fa-book text-sm"></i>
                  </div>
                  <div>
                    <p
                      class="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight"
                    >
                      عنوان الكتاب
                    </p>
                    <h3
                      class="bookTitle text-sm font-black text-[#1b2559] truncate max-w-[200px]"
                      title="اسم الكتاب"
                    >
                     ${book.title}
                    </h3>
                  </div>
                </div>

                <div class="flex flex-col min-w-[180px]">
                  <label class="text-[10px] font-black text-slate-300 mb-1 mr-1"
                    >إختر تصينف الكتاب</label
                  >
                  <select
                    class="categorySelect p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#1b2559] outline-none focus:ring-2 focus:ring-[#8e735b]/20 focus:border-[#8e735b] transition-all cursor-pointer"
                  >
                    <option value="">اختر تصنيف</option>
                    ${categories
                      .map((category) => {
                        return `<option value="${category.id}">${category.name}</option>`;
                      })
                      .join("")}
                  </select>
                </div>
              </div>`;
const validateFunc = async () => {
  let books;

  try {
    books = JSON.parse(jsonInput.value) || [];
    booksJson = books;
  } catch (error) {
    await showAlert("تنسيق JSON غير صحيح:", error.message, "error", null);
    books = [];
    return;
  }

  if (books.length) {
    if (!checkBookRequiredData(books)) {
      await showAlert(
        "بعض الكتب لا تحتوي على جميع البيانات المطلوبة",
        "",
        "error",
        null,
      );
      return;
    }
    document.getElementById("booksContainer").innerHTML = books
      .map((book) => {
        console.log(book);

        return bookCard(book);
      })
      .join("");

    document.getElementById("booksCount").textContent = books.length;
  } else {
    await showAlert(
      "راجع البيانات قد تكون نسيت قفل قوس أو نسيت الفاصلة بين كل كتاب",
      "",
      "error",
      null,
    );
  }
};

validateBtn.addEventListener("click", () => {
  validateFunc();
});

document.getElementById("booksContainer").addEventListener("change", (e) => {
  const elChanged = e.target;
  if (elChanged.classList.contains("categorySelect")) {
    const bookChangedTitle =
      elChanged.parentElement.parentElement.querySelector(
        ".bookTitle",
      ).textContent;

    booksJson.map((book) => {
      if (book.title.trim() == bookChangedTitle.trim())
        return (book.category = elChanged.value);
      else return book;
    });
  }

  const ifAllCategsSelected = () => {
    let res = "";
    document.querySelectorAll(".categorySelect").forEach((el) => {
      if (el.value == "") {
        res += "false";
      } else {
        res += "true";
      }
    });
    return !res.includes("false");
  };

  const uploadBtn = document.getElementById("uploadBtn");

  if (ifAllCategsSelected()) {
    uploadBtn.classList.remove("opacity-30");
    uploadBtn.classList.add("cursor-pointer");
    uploadBtn.classList.remove("cursor-not-allowed");
    uploadBtn.disabled = false;
  } else {
    uploadBtn.classList.add("opacity-30");
    uploadBtn.classList.remove("cursor-pointer");
    uploadBtn.classList.add("cursor-not-allowed");
    uploadBtn.disabled = true;
  }
});

const uploadingProgressLayout = (status, currentIndex) => {
  const progressOverlay = document.getElementById("progressOverlay");
  const progressBar = document.getElementById("progressBar");
  const progressPercent = document.getElementById("progressPercent");
  const currentCountText = document.getElementById("currentCount");
  const totalCountText = document.getElementById("totalCount");

  // 1. التحكم في الظهور والاختفاء
  if (status === "on") {
    progressOverlay.classList.remove("hidden");
  } else {
    progressOverlay.classList.add("hidden");
    return; // اخرج من الدالة لو بنقفل الـ Popup مش محتاجين نحسب حاجة
  }

  // 2. حسابات التقدم
  const total = booksJson.length;
  const current = currentIndex + 1; // عشان نبدأ العد من 1 للمستخدم
  const percentage = Math.round((current / total) * 100);

  // 3. تحديث العناصر في الـ DOM
  progressBar.style.width = `${percentage}%`;
  progressPercent.textContent = percentage;
  currentCountText.textContent = current;
  totalCountText.textContent = total;

  // 4. تغيير الحالة النصية بناءً على التقدم
  const statusText = document.getElementById("progressStatus");
  if (percentage === 100) {
    progressBar.style.width = `100%`;

    statusText.textContent = "تم رفع جميع الكتب بنجاح! جاري إنهاء العملية...";
  }
};

uploadBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let bookUploaded = 0;
  uploadingProgressLayout("on", bookUploaded);

  for (let book of booksJson) {
    try {
      const response = await fetchCreateOneBook(book);
      
      uploadingProgressLayout("on", bookUploaded);
      bookUploaded++;
      console.log("response => ", response);
    } catch (error) {
      console.log("error => ", error);
      await showAlert(error.message || error, "", "error", null);
    }
  }
  await showAlert("تمت الإضافة بنجاح", "", "success", "admin-books.html");
  uploadingProgressLayout("off");
});

window.onload = () => loadingDataLayout("off");


