const ApiError = require("../utils/ApiError");

const roleChecker =
  (...roles) =>
  (req, res, next) => {
    if (roles.indexOf(req.user.userData.role) === -1) {
      return next(new ApiError("لا تملك الصلاحية لهذا الإجراء", 403));
    }
    console.log("Current role:", req.user?.userData?.role);
    if (typeof next === "function") {
      return next();
    } else {
      console.log("Strange: next is not a function!");
      res.status(500).send("Internal Server Error");
    }
  };

module.exports = {
  roleChecker,
};
