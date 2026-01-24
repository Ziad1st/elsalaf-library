import { fetchUserProfile } from "./utils/protectedFetchs.js";
import { booksCount } from "./utils/fetchBooks.js";
const adminName = document.getElementById("adminName");
const totalBooks = document.getElementById("totalBooks");

// Fetch user profile
totalBooks.textContent = await booksCount();

const adminData = await fetchUserProfile();
adminName.textContent = adminData.user.name;
