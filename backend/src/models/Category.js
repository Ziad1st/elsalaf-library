const mongoose = require("mongoose");
const Book = require("./Book");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "يجب إدخال اسم القسم"],
      unique: [true, "اسم القسم موجود بالفعل"], // يمنع تكرار نفس القسم
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: [true, "يجب إدخال ترتيب القسم"],
      unique: [true, "ترتيب القسم محجوز لقسم آخر"],
      default: 0,
    },
    categoryColor: {
      type: String,
      default: "#8e735b",
    },
    bookCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });
// Middleware لتحويل الاسم إلى slug (اختياري للروابط المباشرة)
categorySchema.virtual("slug").get(function () {
  return this.name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
});

categorySchema.method("updateBookCount", async function () {
  const bookCount = await Book.countDocuments({ category: this._id });
  this.bookCount = bookCount;
  await this.save();
});

module.exports = mongoose.model("Category", categorySchema);
