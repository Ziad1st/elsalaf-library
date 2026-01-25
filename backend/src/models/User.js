const mongoose = require("mongoose");
const { generateUserImage } = require("../utils/generateImages");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "يرجى إدخال الاسم"] },
    image: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false }, // select: false لمنع رجوع الباسورد في الاستعلامات العادية
    role: {
      type: String,
      enum: ["user", "admin", "publisher"],
      default: "user",
    },
    refreshToken: { type: String, select: false },
    status: { type: String, enum: ["active", "banned"], default: "active" },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("autoUserImage").get(function () {
  // نولد الصورة البرمجية لو مفيش صورة مرفوعة
  return generateUserImage(
    this.name.split(" ").slice(0, 2).join(" "),
    // نحدد فقط من إسم المستخدم أول اسم وثاني اسم
  );
});

userSchema.index(
  { name: "text", email: "text" },
  {
    default_language: "none",
    weights: { name: 10, email: 5 },
  },
);

module.exports = mongoose.model("User", userSchema);

