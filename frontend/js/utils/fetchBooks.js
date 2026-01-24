import { showAlert } from "./alertModal.js";
import { API_URL } from "./API_URL.js";
import { smartFetch } from "./smartFetch.js";

export const fetchBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/api/books`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    await showAlert(
      "حدث خطأ أثناء جلب الكتب تأكد من الإتصال بالإنترنت",
      "",
      "error",
      null,
    );
    return [];
  }
};

export const fetchBooksWithPagination = async (
  page,
  limit,
  categoryId = null,
  publisherId = null,
  searchValue = null,
) => {
  let url;
  if (categoryId) {
    url = `${API_URL}/api/books/page?page=${page}&limit=${limit}&categoryId=${categoryId}`;
  } else if (searchValue) {
    url = `${API_URL}/api/books/page?page=${page}&limit=${limit}&search=${searchValue}`;
  } else {
    url = `${API_URL}/api/books/page?page=${page}&limit=${limit}`;
  }
  try {
    let response = !publisherId
      ? await fetch(url)
      : await smartFetch(url, { method: "GET" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    await showAlert(
      "حدث خطأ أثناء جلب الكتب تأكد من الإتصال بالإنترنت",
      "",
      "error",
      null,
    );
  }
};

export const fetchBooksByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/api/books/category/${categoryId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    await showAlert(
      "حدث خطأ أثناء جلب الكتب تأكد من الإتصال بالإنترنت",
      "",
      "error",
      null,
    );
  }
};

export const booksCount = async () => {
  try {
    const response = await fetch(`${API_URL}/api/books/booksCount`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.count;
  } catch (error) {
    await showAlert(
      "حدث خطأ أثناء جلب عدد الكتب تأكد من الإتصال بالإنترنت",
      "",
      "error",
      null,
    );
  }
};
