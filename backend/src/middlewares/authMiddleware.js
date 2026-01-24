const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return next(new ApiError("يرجى تسجيل الدخول أولا", 401));
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("typeof next===> " + typeof next);
    if (typeof next === "function") {
      return next();
    } else {
      console.log("next is not a function!");
      res.status(500).send("Internal Server Error");
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "jwt expired" });
    }
    return next(new ApiError("توكن غير صالح", 401));
  }
};

module.exports = { authMiddleware };
