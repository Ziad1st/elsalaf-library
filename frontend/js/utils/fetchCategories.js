import { showAlert } from "./alertModal.js";
import { API_URL } from "./API_URL.js";

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/categories`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    await showAlert(
      "حدث خطأ أثناء جلب البيانات تأكد من الإتصال بالإنترنت",
      "",
      "error",
      null,
    );

    return [];
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/api/categories/${categoryId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    await showAlert(
      "حدث خطأ أثناء جلب البيانات تأكد من الإتصال بالإنترنت",
      "",
      "error",
      null,
    );
    return null;
  }
};
