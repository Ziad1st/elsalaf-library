const express = require("express");
const router = express.Router();
const { roleChecker } = require("../middlewares/roleCheckerMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getAllBooks,
  getBooksWithPagination,
  getBook,
  bookCount,
  createBook,
  updateBook,
  deleteBook,
  getBooksWithCategory,
  updateBookViewsOrDownloadCounts,
  getBooksByPublisherId,
  getCountOfBooksByPublisherId,
  getBooksHaveMoreViews,
} = require("../controllers/bookController");
const {
  checkUserBanMidleware,
} = require("../middlewares/checkUserBanMidleware");

router.get("/", getAllBooks);
router.get("/moreViews", getBooksHaveMoreViews);
router.get("/booksCount", bookCount);
router.get("/page", getBooksWithPagination);
router.get("/category/:categoryId", getBooksWithCategory);
router.get("/:id", getBook);

router.get(
  "/booksCountByPublisher/:id",
  authMiddleware,
  roleChecker("admin"),
  checkUserBanMidleware,
  getCountOfBooksByPublisherId,
);
router.get(
  "/booksByPublisher/:id",
  authMiddleware,
  roleChecker("admin"),
  checkUserBanMidleware,
  getBooksByPublisherId,
);
router.post(
  "/",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin", "publisher"),
  createBook,
);
router.put(
  "/:id",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  updateBook,
);
router.put("/updateDataByUserActions/:id", updateBookViewsOrDownloadCounts);
router.delete(
  "/:id",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  deleteBook,
);

module.exports = router;
