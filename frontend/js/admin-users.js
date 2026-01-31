import { showAlert } from "./utils/alertModal.js";
import { confirmModal } from "./utils/confirmModal.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
import {
  fetchUserProfile,
  fetchUsers,
  updateUserRole,
  banUser,
  countOfBooksAddedByUser,
} from "./utils/protectedFetchs.js";
let userProfile;
let users;
  loadingDataLayout("on","جاري تحميل المستخدمين...")
//>> S render users
const usersContainer = document.getElementById("users-container");
const renderUsers = async (usersArr = users) => {
  try {
    userProfile = await fetchUserProfile();
    users = await fetchUsers();
    if (!users[0]) {
      await showAlert("لا تملك الصلاحية لعرض المستخدمين", "", "error", null);
      throw new Error("لا تملك الصلاحية لعرض المستخدمين");
    }
    if (!usersArr) usersArr = users;
    console.log(usersArr);
  } catch (error) {
    console.error(error);
    await showAlert(error.message || error, "", "error", null);
    return;
  } finally{
      setTimeout(()=>{
        loadingDataLayout("off")
      },1000) 
  }
  
  const userCardLayout = (userData) => {
    return `
            <tr user-id="${userData._id}" title="show user details" class="user-row transition-all ${userData._id === userProfile.user._id ? "bg-[#1b2559] border-r-[3px] border-b-[2px] border-t-[2px] border-[#1b2559] border-b-0 hover:bg-[#1b2559] " : " border-r-3 border-r-[#e0dcd5]  hover:bg-[lavender] hover:border-r-[#1b2559] cursor-pointer"}">
                <td class="p-6 flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full ${userData._id === userProfile.user._id ? "text-gray-200 bg-[#8e735b]" : "bg-[#1b2559]/10"} text-[#8e735b] flex items-center justify-center font-bold"
                  >
                    ${userData.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p class="font-black ${userData._id === userProfile.user._id ? "text-gray-200" : "text-[#1b2559]"} text-sm">
                      ${userData.name}
                    </p>
                    <p class="userEmail text-[10px] ${userData._id === userProfile.user._id ? "text-gray-200" : "text-slate-400"} italic font-medium">
                      ${userData.email}
                    </p>
                  </div>
                </td>
                <td class="p-6">
                  <span
                    class="role-admin px-3 py-1 rounded-lg text-[13px] font-black uppercase tracking-tighter"
                    >${
                      userData.role === "admin"
                        ? "مدير"
                        : userData.role === "publisher"
                          ? "ناشر"
                          : "مستخدم"
                    }</span
                  >
                </td>
                <td class="p-6 text-xs font-bold ${userData.createdAt ? (userData._id === userProfile.user._id ? "text-slate-100" : "text-slate-500") : "text-red-400 font-black"}">
                  ${userData.createdAt ? new Date(userData.createdAt).toLocaleDateString("ar-EG") : "غير_مُسجَل"}
                </td>
                <td class="p-6">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-2 h-2 rounded-full bg-${
                        userData.status === "active" ? "green" : "red"
                      }-500"
                    ></span>
                    <span class="text-[10px] ${userData._id === userProfile.user._id ? "text-gray-200" : "text-slate-600"} font-bold"
                      >${userData.status === "active" ? "نشط" : "غير نشط"}</span
                    >
                  </div>
                </td>
                <td class="p-6">
                ${
                  userData._id !== userProfile.user._id
                    ? `
                  <div class="flex items-center justify-center gap-3">
                    
                    <div class="flex flex-col items-center gap-1 group">
                    <div class="relative">
                        <select
                        data-original-role="${userData.role}"
                        title="تغيير رتبة المستخدم"
                        class="appearance-none pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 text-[#1b2559] text-[10px] font-bold rounded-lg focus:ring-2 focus:ring-[#1b2559]/10 outline-none cursor-pointer hover:border-[#1b2559]/30 transition-all">
                        <option value="admin" ${userData.role === "admin" ? "selected" : ""}>مدير</option>
                        <option value="publisher" ${userData.role === "publisher" ? "selected" : ""}>ناشر</option>
                        <option value="user" ${userData.role === "user" ? "selected" : ""}>مستخدم</option>
                        </select>
                        <i class="fa-solid fa-user-shield absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] pointer-events-none"></i>
                    </div>
                    </div>

                    <button 
                    data-current-status="${userData.status}"
                    title="${userData.status == "active" ? "حظر المستخدم" : "فك حظر المستخدم"}"
                    class="banUser w-9 h-9 rounded-xl ${userData.status === "active" ? "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white" : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"} transition-all shadow-sm flex items-center justify-center group">
                        <i class="banUser fa-solid fa-ban text-xs group-hover:scale-110 transition-transform"></i>
                    </button>

                </div>
                `
                    : `
                      <div class="flex items-center justify-center gap-3">
                        <div class="inline-flex items-center justify-center w-8 h-8 border-0 bg-[#8e735b] rounded-[10px]">
                          <i class="fa-solid fa-user text-white"></i>
                        </div>
                      </div>
                    `
                }
                </td>
              </tr>`;
  };

  usersContainer.innerHTML = usersArr.map(userCardLayout).join("");
  document.getElementById("usersCount").textContent = usersArr.length;
};

renderUsers();
//>> E render users
//>> S update user
const reRenderUsers = async (filterValue, searchValue) => {
  loadingDataLayout("on","عرض المستخدمين...")
  try {
    let users;
    try {
      if (filterValue) {
        users = await fetchUsers(filterValue);
      } else if (searchValue) {
        users = await fetchUsers(null, searchValue);
      } else {
        users = await fetchUsers();
      }
    } catch (error) {
      console.error(error);
      await showAlert(error.message || error, "", "error", null);
      return;
    }
    await renderUsers(users);
  } catch (error) {
    console.error(error);
    await showAlert(error.message || error, "", "error", null);
  } finally{
      loadingDataLayout("off")
  }
};
const updateUserRoleFun = async (userId, role) => {
  try {
    const result = await updateUserRole(userId, role);
    if (result.success) {
      await showAlert("تم تحديث دور المستخدم", "", "success", null);
      await reRenderUsers();
    }
  } catch (error) {
    console.error(error);
    await showAlert(error.message || error, "", "error", null);
  }
};
usersContainer.addEventListener("change", async (e) => {
  const elChanged = e.target;
  const emailForUserUpdate = elChanged
    .closest("tr")
    .querySelector(".userEmail").textContent;
  const roleForUserUpdate = elChanged.value;
  const confirmaition = await confirmModal(
    `هل انت متأكد من تغيير دور المستخدم ${emailForUserUpdate} إلى ${roleForUserUpdate}?`,
    "تأكيد التحديث",
  );
  if (confirmaition) {
    const getUserId = users.find(
      (user) => user.email.trim() === emailForUserUpdate.trim(),
    )._id;
    updateUserRoleFun(getUserId, roleForUserUpdate);
  } else {
    elChanged.value = elChanged.getAttribute("data-original-role");
  }
});
//>> E update user
//>> S ban user
const banUserFunc = async (userId, banStatus) => {
  try {
    const result = await banUser(userId, banStatus);
    if (result.success) {
      await showAlert("تم تحديث حالة المستخدم", "", "success", null);
      await reRenderUsers();
    }
  } catch (error) {
    console.error(error);
    await showAlert(error.message || error, "", "error", null);
  }
};
//>> E ban user

//>> S show user details
const userModalPopup = document.getElementById("userModal");

const renderUserDetails = async (user) => {
  const modalUserId = document.getElementById("modalUserId");
  const modalUserName = document.getElementById("modalUserName");
  const publisherBooksCount = document.getElementById("publisherBooksCount");
  const modalUserEmail = document.getElementById("modalUserEmail");
  const goToUserBooksBtn = document.querySelector("a.goToUserBooks");

  modalUserId.textContent = user._id;
  modalUserName.textContent = user.name;
  modalUserEmail.textContent = user.email;
  goToUserBooksBtn.href = `admin-books.html?user=${user._id}`;
  goToUserBooksBtn.target = "_blank";
  publisherBooksCount.textContent =
    (await countOfBooksAddedByUser(user._id)) || "لم يضف أي كتب";
  if ((await countOfBooksAddedByUser(user._id)) == 0 || user.role == "user") {
    goToUserBooksBtn.href = "#";
    goToUserBooksBtn.textContent =
      user.role == "user" ? "مستخدم عادي" : "المستخدم لم يضف كتب بعد";
    goToUserBooksBtn.disabled = true;
    goToUserBooksBtn.target = "_self";
    // 3. تطبيق الستايل بأسلوب أنظف (Tailwind)
    goToUserBooksBtn.className =
      "goToUserBooks px-4 w-full py-2 rounded-lg bg-gray-200 text-gray-400  cursor-not-allowed border border-gray-200 opacity-80 flex items-center justify-center gap-2";

    // إضافة أيقونة "قفل" تعطي طابعاً احترافياً
    goToUserBooksBtn.innerHTML += `<i class="fa-solid fa-lock text-[10px]"></i>`;
  } else {
    goToUserBooksBtn.className =
      "goToUserBooks px-8 py-3 w-full bg-[#1b2559] text-white hover:shadow-lg border-[2px] hover:rounded-[10px] hover:bg-transparent hover:border-[#1b2559] hover:text-[#1b2559] rounded-xl font-bold text-center hover:shadow-lg transition-all";
    goToUserBooksBtn?.querySelector("i.fa-lock")?.remove();
    goToUserBooksBtn.textContent = "الذهاب للكتب التي أضافها المستخدم";
  }
};
const showUserDetails = (userId) => {
  userModalPopup.classList.remove("hidden");
  console.log("Showing details for user:", userId);
  const user = users.find((u) => u._id.trim() === userId.trim());
  renderUserDetails(user);
  console.log(user);
};
//>> S show user details

window.addEventListener("click", async (e) => {
  const elClicked = e.target;
  const ifElClicked = (elClass) => elClicked.classList.contains(elClass);
  if (ifElClicked("banUser")) {
    let bannStatus = elClicked
      .closest("button")
      .getAttribute("data-current-status");

    console.log("USER " + bannStatus.toUpperCase());
    const emailForUser = elClicked
      .closest("tr")
      .querySelector(".userEmail").textContent;
    console.log(emailForUser);
    const userId = users.find(
      (user) => user.email.trim() === emailForUser.trim(),
    )._id;
    bannStatus = bannStatus === "active" ? "banned" : "active";
    console.log("USER WILL BE " + bannStatus.toUpperCase());

    const confarmation = await confirmModal(
      `هل انت متأكد من ${bannStatus === "banned" ? "حظر" : "فك حظر"} هذا المستخدم؟`,
      "تأكيد الحظر",
    );

    if (confarmation) {
      banUserFunc(userId, bannStatus);
    }
  } else if (elClicked.closest(".user-row") && elClicked.tagName !== "SELECT") {
    const userId = elClicked.closest(".user-row").getAttribute("user-id");
    showUserDetails(userId);
  } else if (elClicked.closest(".close-popup")) {
    userModalPopup.classList.add("hidden");
  } else if (elClicked.closest(".copyUserDataBtn")) {
    const dataToCopy = elClicked
      .closest("button")
      .parentElement.querySelector(".userData").innerText;

    copyUserData(dataToCopy);
  }
});
//>> E ban user

async function copyUserData(dataToCopy) {
  const data = dataToCopy;

  navigator.clipboard.writeText(data);
  await showAlert("تم النسخ بنجاح", "", "success", null);
}
//>> S filter users
export function filterUsers(filterValue) {
  reRenderUsers(filterValue);
}
//>> E filter users

//>> S search users
const searchUsersInput = document.getElementById("searchUsersInput");
searchUsersInput.addEventListener("keyup", async (e) => {
  if (e.target.value.trim() == "") {
    await reRenderUsers();
    return;
  }
  if (e.key === "Enter" || e.key === "NumpadEnter" || e.key === "Escape") {
    const searchValue = e.target.value.trim().toLowerCase();

    if (searchValue.length < 3) {
      await showAlert(
        "البحث يجب ان يحتوي على 3 حروف على الأقل",
        "",
        "warning",
        null,
      );
      searchUsersInput.blur();
      searchUsersInput.value = "";
      return;
    }
    await reRenderUsers(null, searchValue);
  }
});
//>> E search users
window.onload = loadingDataLayout("off");






