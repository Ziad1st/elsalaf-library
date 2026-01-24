import { smartFetch } from "./smartFetch.js";
import { API_URL } from "./API_URL.js";
import { showAlert } from "./alertModal.js";

export const fetchCreateOneBook = async (bookData) => {
  return await smartFetch(`${API_URL}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });
};

export const fetchUserProfile = async () => {
  try {
    const res = await smartFetch(`${API_URL}/api/users/profile`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(res.message);
    }
    return res.json();
  } catch (error) {
    await showAlert("حدث خطأ أثناء جلب بيانات المستخدم", "", "error", null);
    return { message: "خطأ في جلب بيانات المستخدم, ربما لم تُسجل الدخول" };
  }
};

export const fetchUsers = async (userFilter = null, searchValue = null) => {
  try {
    let res;
    if (userFilter) {
      res = await smartFetch(`${API_URL}/api/users?filter=${userFilter}`, {
        method: "GET",
      });
    } else if (searchValue) {
      res = await smartFetch(`${API_URL}/api/users?search=${searchValue}`, {
        method: "GET",
      });
    } else {
      res = await smartFetch(`${API_URL}/api/users`, {
        method: "GET",
      });
    }
    if (!res.ok) throw new Error(res.message);
    return res.json();
  } catch (error) {
    await showAlert("حدث خطأ أثناء جلب بيانات المستخدم", "", "error", null);
    return { message: "خطأ في جلب بيانات المستخدم, ربما لم تُسجل الدخول" };
  }
};

export const updateUserRole = async (userId, role) => {
  const adminOrPublisherOrUser =
    role === "admin" ? "admin" : role === "publisher" ? "publisher" : "user";
  try {
    const res = await smartFetch(
      `${API_URL}/api/users/${adminOrPublisherOrUser}/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      },
    );
    if (!res.ok) throw new Error(res.message);
    return { success: true, message: "تم تحديث الصلاحية بنجاح" };
  } catch (error) {
    console.error(error);
    await showAlert("حدث خطأ أثناء تحديث الصلاحية", "", "error", null);
    return { success: false, message: "خطأ في تحديث الصلاحية" };
  }
};

export const banUser = async (userId, bannStatus) => {
  try {
    const res = await smartFetch(`${API_URL}/api/users/ban/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: bannStatus }),
    });
    if (!res.ok) throw new Error(res.message);
    return { success: true, message: "تم تحديث الحظر بنجاح" };
  } catch (error) {
    console.error(error);
    await showAlert("حدث خطأ أثناء تحديث الحظر", "", "error", null);
    return { success: false, message: "خطأ في تحديث الحظر" };
  }
};

export const countOfBooksAddedByUser = async (publisherId) => {
  try {
    const res = await smartFetch(
      `${API_URL}/api/books/booksCountByPublisher/${publisherId}`,
      { method: "GET" },
    );
    if (!res.ok) throw new Error(res.message);
    return (await res.json()).booksCount;
  } catch (error) {
    console.error(error);
    await showAlert("حدث خطأ أثناء جلب عدد الكتب", "", "error", null);
    return 0;
  }
};
export const booksAddedByUser = async (publisherId) => {
  try {
    const res = await smartFetch(
      `${API_URL}/api/books/booksByPublisher/${publisherId}`,
      { method: "GET" },
    );
    if (!res.ok) throw new Error(res.message);
    return (await res.json()).books;
  } catch (error) {
    console.error(error);
    await showAlert("حدث خطأ أثناء جلب الكتب", "", "error", null);
    return [];
  }
};
