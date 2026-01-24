const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleChecker } = require("../middlewares/roleCheckerMiddleware");
const {
  checkUserBanMidleware,
} = require("../middlewares/checkUserBanMidleware");
const {
  getUsers,
  getUser,
  makeUserPublisher,
  makeUserAdmin,
  getUserProfile,
  makeUserNormalUser,
  banUser,
  countUsers,
} = require("../controllers/usersController");

router.get("/count", countUsers);
router.get("/profile", authMiddleware, getUserProfile);
router.get(
  "/",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  getUsers,
);
router.get(
  "/:id",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  getUser,
);
router.put(
  "/publisher/:id",
  authMiddleware,
  roleChecker("admin"),
  makeUserPublisher,
);
router.put(
  "/user/:id",
  authMiddleware,
  roleChecker("admin"),
  makeUserNormalUser,
);
router.put(
  "/ban/:id",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  banUser,
);

router.put(
  "/admin/:id",
  authMiddleware,
  checkUserBanMidleware,
  roleChecker("admin"),
  makeUserAdmin,
);

module.exports = router;
