import { fetchUserProfile } from "./protectedFetchs.js";
import { loadingDataLayout } from "./loadingDataLayout.js";
import { logout } from "../utils/logout.js";
import { showAlert } from "./alertModal.js";
const userProfile = localStorage.getItem("accessToken")
  ? (await fetchUserProfile()).user
  : null;
//>> S render fixed pannel link
const fixedPannelLinkRendering = async () => {
  const pannelPageForAdminOrPublisher = document.createElement("a");
  pannelPageForAdminOrPublisher.href = "admin-index.html";
  pannelPageForAdminOrPublisher.className = "admin-pannel-page";
  pannelPageForAdminOrPublisher.innerText = "الذهاب للوحة التحكم";

  // 1. تحديد الحالات (Status)
  const isBanned = userProfile?.status === "banned";

  // 2. دالة لتعيين الستايل الأساسي (الافتراضي)
  const setBaseStyle = () => {
    pannelPageForAdminOrPublisher.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 100;
    width: max-content;
    height: fit-content;
    padding: 3px 40px;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

    if (isBanned) {
      // تنسيق حالة المحظور (Banned)
      pannelPageForAdminOrPublisher.innerText = "هذا الحساب محظور";
      pannelPageForAdminOrPublisher.href = "javascript:void(0)";
      Object.assign(pannelPageForAdminOrPublisher.style, {
        background: "#ffe6e6",
        color: "#f44336",
        fontWeight: "bolder",
        borderRadius: "3px",
        cursor: "default",
        fontSize: "14px",
        border: "1px solid #f44336",
      });
    } else {
      // تنسيق الحالة العادية (Normal)
      Object.assign(pannelPageForAdminOrPublisher.style, {
        backgroundColor: "var(--bg-body)",
        color: "#8e735b",
        border: "1.4px dotted #8e735b",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-soft)",
        fontWeight: "normal",
        cursor: "pointer",
        fontSize: "16px",
      });
    }
  };
  setBaseStyle();

  console.log(userProfile);
  if (userProfile?.role == "admin" && userProfile?.status !== "banned")
    document.body.appendChild(pannelPageForAdminOrPublisher);
  else if (
    userProfile?.role == "publisher" &&
    userProfile?.status !== "banned"
  ) {
    document.body.appendChild(pannelPageForAdminOrPublisher);
    pannelPageForAdminOrPublisher.href = "add-book.html";
    pannelPageForAdminOrPublisher.innerText = "إضافة كتاب";
  } else if (userProfile?.status === "banned") {
    pannelPageForAdminOrPublisher.href = "#";
    pannelPageForAdminOrPublisher.innerText = "تم حظرك";
    pannelPageForAdminOrPublisher.classList.add("banned");

    document.body.appendChild(pannelPageForAdminOrPublisher);
  }
};

//>> E render fixed pannel link

//>> S control of navbar links

const loginPageButtons = document.querySelectorAll("a.login-page");
if (userProfile) {
  if (userProfile?._id && userProfile?.email) {
    console.log("Welcome user");
    console.log(loginPageButtons[0]);
    console.log(loginPageButtons[1]);

    loginPageButtons.forEach((btn) => {
      // 1. تغيير الرابط والنص
      btn.href = "logout.html";
      btn.textContent = "خروج";

      // 2. الطريقة الصحيحة لتعيين الحدث برمجياً
      btn.onclick = function (e) {
        e.preventDefault(); // منع فتح الرابط في الصفحة الحالية

        openPopup();
        return false;
      };

      // 3. تحديث الكلاسات (تم تصحيح الإملاء)
      btn.classList.remove("login-page");
      btn.classList.add("logout");
    });
  }
} else {
  loginPageButtons.forEach((btn) => {
    btn.href = "login.html";

    btn.onclick = function (e) {
      e.preventDefault(); // منع فتح الرابط في الصفحة الحالية
      window.location.href = "login.html";
      return false;
    };
  });
}
//>> E control of navbar links

//>> S protecte pages
const protectedPagesHrefs = {
  pagesForAdmins: [
    "admin-books.html",
    "admin-index.html",
    "admin-users.html",
    "edit-book.html",
  ],
  pagesForPublishers: [
    "add-book.html",
    "add-books-json.html",
    "new-category.html",
  ],
};

const currentPage = window.location.pathname.split("/").pop();
const protectePages = async () => {
  if (
    (userProfile?.role !== "admin" || userProfile?.status === "banned") &&
    protectedPagesHrefs.pagesForAdmins.join("_").includes(currentPage)
  ) {
    const vaiolates = localStorage.getItem("vaiolates") || null;
    console.log("not admin");

    if (vaiolates)
      localStorage.setItem("vaiolates", JSON.stringify(Number(vaiolates) + 1));
    else localStorage.setItem("vaiolates", JSON.stringify(0));

    await showAlert(
      "لا تملك الصلاحية للدخول لهذه الصفحة..",
      "",
      "warning",
      null,
    );
    if (userProfile?.status !== "banned")
      await showAlert(
        "تحذير إذا حاولت التلاعب بالموقع سيتم حظرك",
        "",
        "warning",
        null,
      );

    setTimeout(() => {
      window.history.back();
    }, 1000);
  } else if (
    (userProfile?.role !== "publisher" || userProfile?.status === "banned") &&
    protectedPagesHrefs.pagesForPublishers.join("_").includes(currentPage)
  ) {
    console.log("not publisher");

    if (userProfile?.role === "admin") return;
    else {
      await showAlert(
        "لا تملك الصلاحية للدخول لهذه الصفحة..",
        "",
        "warning",
        null,
      );

      setTimeout(() => {
        window.history.back();
      }, 1000);
    }
  } else if (userProfile?.role && currentPage === "new-category.html") {
    document.querySelector("aside").remove();
  } else if (
    userProfile?.role === "publisher" &&
    currentPage === "add-books-json.html"
  ) {
    document.querySelector("aside").remove();
  }
};
console.log(currentPage);
//>> E protecte pages

protectePages();
if (userProfile) {
  fixedPannelLinkRendering();
}

const logoutModalRendering = () => {
  const modalLayout = ` <div
      id="logoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 mx-4">
        <div class="text-center mb-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4"
          >
            <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">تأكيد تسجيل الخروج</h3>
          <p class="text-gray-500 mt-2">
            هل أنت متأكد أنك تريد مغادرة لوحة التحكم؟
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <button
            id="confirmBtn"
            class="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700"
          >
            نعم، سجل الخروج
          </button>
          <button
            id="cancelBtn"
            class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalLayout);
};

logoutModalRendering();
const logoutModal = document.getElementById("logoutModal");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

function openPopup() {
  logoutModal.classList.remove("hidden");
}

// إغلاق النافذة عند الضغط على إلغاء
cancelBtn.addEventListener("click", () => {
  logoutModal.classList.add("hidden");
});
confirmBtn.addEventListener("click", async () => {
  try {
    loadingDataLayout("on", "جاري تسجيل الخروج");
    const logoutRes = await logout();
    if (logoutRes.success === true) {
      await showAlert("تم تسجيل الخروج بنجاح", "", "success", null);
      window.location.href = "home.html";
    }
  } catch (error) {
    console.error(error);
  } finally {
    logoutModal.classList.add("hidden");
  }
});



   setTimeout(()=>{
      const pageTitle = document.getElementById('page-title');

    const pageIcon = document.getElementById('page-icon');

    const path = window.location.href;



    const pageData = {

        'admin-index.html': { title: 'لوحة التحكم', icon: 'fa-chart-pie' },

        'admin-books.html': { title: 'إدارة المكتبة', icon: 'fa-book-bookmark' },

        'admin-users.html': { title: 'شؤون المستخدمين', icon: 'fa-user-gear' }

    };



    // البحث عن الصفحة الحالية وتحديث البيانات

     Object.keys(pageData).forEach(key => {
    if (path.includes(key)) {
        const currentPage = pageData[key]; 
        
        pageTitle.innerText = currentPage.title;
        pageIcon.className = `fa-solid ${currentPage.icon} text-lg`;
    }
     
   
   },1000)





const sidebar = document.getElementById('sidebar');

const menuToggle = document.getElementById('menu-toggle');

const overlay = document.getElementById('overlay');



function toggleSidebar() {

    console.log("toggled")

    const isHidden = sidebar.classList.contains('translate-x-full') || sidebar.classList.contains('hidden');

    

    if (isHidden) {

        sidebar.classList.remove('hidden', 'translate-x-full');

        sidebar.classList.add('flex', 'translate-x-0');

        overlay.classList.remove('hidden');

        overlay.classList.add('opacity-100');

    } else {

        sidebar.classList.add('translate-x-full');

        sidebar.classList.remove('translate-x-0');

        overlay.classList.add('hidden');

        setTimeout(() => sidebar.classList.add('hidden'), 300);

    }

}



menuToggle.addEventListener('click', toggleSidebar);

overlay.addEventListener('click', toggleSidebar);







