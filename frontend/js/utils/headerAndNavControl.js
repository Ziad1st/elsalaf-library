const currentPage = window.location;

const navbar = document.querySelectorAll("#navbar");

const navLinks = navbar[0].querySelectorAll("a");
const navMobileLinks = navbar[1].querySelectorAll("a");

navLinks.forEach((link) => {
  if (link.href == currentPage) {
    link.classList.add("active");
  }
});

navMobileLinks.forEach((link) => {
  if (link.href == currentPage) {
    link.classList.add("active");
  }
});

window.addEventListener("click", (e) => {
  const elClicked = e.target;
  if (
    elClicked ==
    `<a class="px-6 py-2 rounded-xl font-bold text-white transition shadow-md hover:brightness-110 active:scale-95 text-sm loguot" style="background-color: var(--accent)" href="#">خروج</a>`
  ) {
    console.log("Logged out");
  }
});

const searchBooksInput = document.getElementById("booksSearch");
searchBooksInput.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.key === "Enter" || e.key === "search") {
    const searchValue = document.getElementById("booksSearch").value;
    if (searchValue) {
      const searchValue2 = searchValue.includes("ال")
        ? searchValue.split("ال")[1]
        : searchValue;
      const searchValue3 = searchValue.includes("كتاب")
        ? searchValue.split("كتاب")[1]
        : searchValue;
      const searchQuery = [searchValue, searchValue2, searchValue3]
        .filter((val) => val && val !== "null") // تنظيف المصفوفة
        .join(" ");
      window.location.href = `library-books.html?search=${searchQuery}`;
    }
  }
});
