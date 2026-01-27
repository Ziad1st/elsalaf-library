const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const bcrypt = require("bcrypt");

// 1. تعريف الإعدادات في الأعلى لتكون متاحة للجميع
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    throw new Error("رجاء ادخل البريد الالكتروني و كلمة المرور و إسم المستخدم");

  const hashedPassword = await bcrypt.hash(password, 10);
  if (await User.findOne({ email }))
    throw new Error("هذا المستخدم موجود بالفعل");

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const refreshToken = generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  user.refreshToken = refreshToken;
  await user.save();
  // ابعت الكوكي الجديدة
  res.status(200).json({ accessToken: generateAccessToken(user) });
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("البيئة الحالية هي:", process.env.NODE_ENV);
  console.log("إعدادات الـ Secure هي:", cookieOptions.secure);
  const { email, password } = req.body;

  if (!email || !password)
    throw new Error("رجاء ادخل البريد الالكتروني و كلمة المرور");

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user)
    throw new Error("البيانات غير صحيحة, تأكد من صحة الإيميل و كلمة المرور");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new Error("البيانات غير صحيحة, تأكد من صحة الإيميل و كلمة المرور");

  const refreshToken = generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  user.refreshToken = refreshToken;
  await user.save();
  // ابعت الكوكي الجديدة
  console.log(user);
  console.log(
    "refreshToken===>  ",
    req.cookies?.refreshToken || `not found==> ${JSON.stringify(req.cookies)}`,
  );
  res.status(200).json({ accessToken: generateAccessToken(user) });
});

const refreshToken = asyncHandler(async (req, res) => {
  const cookies = req?.cookies;
  const errorMessage = [
    "لا تملك الصلاحية لهذا الإجراء",
    "تحذير،لا تحاول التلاعب بالموقع حتى لا تُحظر منه!!!",
  ];
  if (!cookies?.refreshToken) throw new ApiError(errorMessage[0], 401);

  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });

  console.log("refresh token => ", refreshToken);
  console.log("user => ", user);
  if (!user) throw new ApiError(errorMessage[1], 403);

  const accessToken = generateAccessToken(user);

  res.status(200).json({
    status: "token refreshed Successfully",
    accessToken,
    role: user.role,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req?.cookies;

  if (!cookies?.refreshToken) {
    // إذا لم تكن هناك كوكي، نمسحها من المتصفح احتياطياً ونرد بنجاح
    // لأن الهدف هو أن يخرج المستخدم في النهاية
    res.clearCookie("refreshToken", cookieOptions);
    console.log(
      "Already logged out==> ",
      cookies?.refreshToken || "no refresh Token",
    );

    return res.status(200).json({ status: "Already logged out" });
  }

  const user = await User.findOne({ refreshToken: cookies.refreshToken });

  if (user) {
    user.refreshToken = "";
    await user.save();
  }

  console.log("logout Successfully==> ", cookies);

  // يجب تمرير نفس الخيارات عند الحذف (باستثناء maxAge)
  res.clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ status: "logout Successfully" });
});

module.exports = { registerUser, loginUser, refreshToken, logoutUser };

