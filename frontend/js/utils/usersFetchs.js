import { showAlert } from "./alertModal.js";
import { API_URL } from "./API_URL.js";

export const fetchUsersCount = async () => {
  try {
    const res = await fetch(`${API_URL}/api/users/count`);
    if (!res.ok) throw new Error(res.message);
    const data = await res.json();
    console.log(data);
    return data.count;
  } catch (err) {
    showAlert("حدث خطأ أثناء جلب عدد المستخدمين للمكتبة", "", "error", null);
  }
};
