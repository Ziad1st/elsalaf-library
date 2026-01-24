const mongoose = require("mongoose");
const { generateBookCover } = require("../utils/generateImages");

const randomRate = () => {
  return (Math.random() * 4 + 1).toFixed(1);
};

const randomVeiws = () => {
  return (Math.random() * 20 + 1).toFixed(0);
};

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "يجب إدخال عنوان الكتاب"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "يجب إدخال اسم المؤلف"],
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "you should add addedBy"],

      ref: "User",
    },

    description: {
      type: String,
      required: [true, "يجب إضافة وصف بسيط للكتاب"],
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    cover: {
      type: String,
    },
    pdfUrl: {
      type: String,
      required: [true, "يجب إضافة رابط ملف الـ PDF"],
    },
    pagesNumber: {
      type: Number,
    },
    publisher: {
      type: String,
      required: [true, "يجب إضافة دار النشر"], // دار النشر (مهم جداً في كتب السلف)
      trim: true,
    },
    rate: {
      type: Number,
      default: randomRate(),
      min: 1,
      max: 5,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    authorDeathYear: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // يضيف تاريخ الإنشاء والتعديل تلقائياً
  },
);

bookSchema.set("toJSON", { virtuals: true });
bookSchema.set("toObject", { virtuals: true });

bookSchema.virtual("autoCover").get(function () {
  if (this.cover) {
    // نرجع رابط الصورة المرفوعة
    return `${this.cover}`;
  }
  // نولد الصورة البرمجية لو مفيش صورة مرفوعة
  return generateBookCover(this.title, this.author, this.publisher);
});

bookSchema.post("save", async function () {
  if (this.category) {
    const Category = mongoose.model("Category");
    const category = await Category.findById(this.category);
    if (category) {
      await category.updateBookCount();
      console.log(`تم تحديث عداد الكتب للقسم: ${category.name}`);
    }
  }
});

bookSchema.post("findOneAndDelete", async function (doc) {
  // doc هو الكتاب الذي تم حذفه
  if (doc && doc.category) {
    const Category = mongoose.model("Category");
    const category = await Category.findById(doc.category);
    if (category) {
      await category.updateBookCount();
      console.log(`تم تحديث العداد بعد حذف الكتاب من قسم: ${category.name}`);
    }
  }
});

bookSchema.index({ createdAt: -1 });

// إضافة "Index" للبحث السريع بالعنوان والمؤلف
bookSchema.index(
  { title: "text", author: "text", publisher: "text" },
  {
    default_language: "none",
    weights: { title: 20, author: 15, publisher: 5 },
  },
);

module.exports = mongoose.model("Book", bookSchema);
