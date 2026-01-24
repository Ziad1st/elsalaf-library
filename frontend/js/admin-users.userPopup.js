import { showAlert } from "./utils/alertModal";

// دالة لفتح المودال وعرض البيانات
async function showUserDetails(userId) {
  const modal = document.getElementById("userModal");
  const content = document.getElementById("userModalContent");
  const booksContainer = document.getElementById("modalUserBooks");
  const noBooksMessage = document.getElementById("noBooksMessage");

  // 1. إظهار المودال (حالة تحميل)
  modal.classList.remove("hidden");
  document.getElementById("modalUserId").innerText = userId;
  booksContainer.innerHTML =
    '<div class="col-span-2 text-center py-5"><i class="fa-solid fa-circle-notch animate-spin text-2xl text-[#8e735b]"></i></div>';

  try {
    // 2. جلب بيانات الكتب الخاصة بهذا المستخدم من السيرفر
    // ملاحظة: تأكد من وجود Route في الباك إند يجلب كتب مستخدم معين
    const response = await fetch(`${API_URL}/api/books/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const books = await response.json();

    // 3. عرض الكتب
    booksContainer.innerHTML = "";
    document.getElementById("booksCount").innerText = books.length;

    if (books.length === 0) {
      noBooksMessage.classList.remove("hidden");
    } else {
      noBooksMessage.classList.add("hidden");
      books.forEach((book) => {
        booksContainer.innerHTML += `
                    <div class="flex items-center gap-3 p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                        <img src="${API_URL}/${book.image}" class="w-12 h-16 object-cover rounded-lg shadow-sm" onerror="this.src='assets/default-book.png'">
                        <div>
                            <h4 class="text-sm font-bold text-[#1b2559] line-clamp-1">${book.title}</h4>
                            <p class="text-xs text-slate-400">${book.category?.name || "بدون تصنيف"}</p>
                        </div>
                    </div>
                `;
      });
    }
  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدم:", error);
    booksContainer.innerHTML =
      '<p class="text-red-500 text-center col-span-2">فشل جلب البيانات</p>';
  }
}

// دالة الإغلاق
function closeUserModal() {
  document.getElementById("userModal").classList.add("hidden");
}

// دالة نسخ الـ ID
function copyUserId() {
  const id = document.getElementById("modalUserId").innerText;
  navigator.clipboard.writeText(id);
  showAlert("تم نسخ المعرف بنجاح", "", "success", null);
}

// داخل دالة رسم الجدول (renderUsers)
const actionCell = `
    <td>
        <button onclick="showUserDetails('${user._id}')" class="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
            <i class="fa-solid fa-eye"></i> عرض الكتب
        </button>
    </td>
`;
