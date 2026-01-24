const express = require("express");
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategory,
} = require("../controllers/categoriesController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleChecker } = require("../middlewares/roleCheckerMiddleware");
const {
  checkUserBanMidleware,
} = require("../middlewares/checkUserBanMidleware");

router.post(
  "/",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  createCategory,
);
router.put(
  "/:id",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  deleteCategory,
);
router.get("/", getCategories);
router.get("/:id", getCategory);

module.exports = router;
