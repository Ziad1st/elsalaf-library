const ApiError = require("../utils/ApiError");

const checkUserBanMidleware = (req, res, next) => {
  console.log(`checkUserBanMidleware==> ${req.user.userData.status}`);
  // 1. التأكد أولاً من أن المستخدم مسجل دخوله وموجود في الطلب
  if (!req.user || !req.user.userData) {
    return next(); // إذا لم يكن هناك مستخدم، نمرر الطلب (أو نمنعه حسب منطق تطبيقك)
  }

  // 2. الوصول للحالة بأمان
  const userBanStatus = req.user.userData.status;

  // 3. التحقق من الحظر
  if (userBanStatus === "banned") {
    return next(
      new ApiError("تم حظر حسابك من قبل الإدارة. يرجى التواصل مع الدعم.", 403),
    );
  }

  // 4. إذا كان نشطاً، ننتقل للخطوة التالية
  next();
};

module.exports = {
  checkUserBanMidleware,
};
