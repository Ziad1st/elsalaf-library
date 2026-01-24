const Book = require("../models/Book");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllBooks = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 20;

  const books = await Book.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("category");
  res.status(200).json(books);
});

exports.bookCount = asyncHandler(async (req, res) => {
  const count = await Book.countDocuments();
  res.status(200).json({ count });
});

exports.getBooksWithPagination = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const categoryId = req.query.categoryId || null;
  const publisherId = req.query.user || null;
  const searchValue = req.query.search || null;
  const searchQuery = [searchValue]
    .filter((val) => val && val !== "null") // تنظيف المصفوفة
    .join(" ");
  let books;
  if (categoryId) {
    books = await Book.find({ category: categoryId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category", "name");
    return res.status(200).json(books);
  } else if (publisherId) {
    books = await Book.find({ addedBy: publisherId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category", "name");
    return res.status(200).json(books);
  } else if (searchValue) {
    books = await Book.find({
      $text: {
        $search: searchQuery,
      },
    }).populate("category", "name");
    res.status(200).json(books);
  } else {
    books = await Book.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category", "name");
    res.status(200).json(books);
  }
});

exports.getBooksWithCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const books = await Book.find({ category: categoryId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("category", "name");
  res.status(200).json(books);
});

exports.getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("category");
  res.status(200).json({ book });
});

exports.createBook = asyncHandler(async (req, res) => {
  const bookData = {
    ...req.body,
    addedBy: req.user.userData._id,
  };
  console.log("book data ====> ", bookData);

  const book = await Book.create(bookData);
  res.status(201).json({ book });
});

exports.updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ book });
});

exports.updateBookViewsOrDownloadCounts = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  console.log(req.body);
  let book;
  if (req.body.views) {
    book = await Book.findByIdAndUpdate(
      bookId,
      { views: req.body.views },
      {
        new: true,
        runValidators: true,
      },
    );
  }
  if (req.body.downloadCount) {
    book = await Book.findByIdAndUpdate(
      bookId,
      { downloadCount: req.body.downloadCount },
      {
        new: true,
        runValidators: true,
      },
    );
  }
  if (!book) res.status(400).json({ message: "حدث خطأ أثناء تحديث البيانات" });
  res.status(200).json({ book });
});

exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "فشل الحذف، الكتاب غير موجود" });
  }

  res.status(200).json({ message: `تم حذف كتاب (${book.title}) بنجاح` });
});

exports.getBooksByPublisherId = asyncHandler(async (req, res) => {
  const publisherId = req.params.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const books = await Book.find({ addedBy: publisherId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("category", "name");
  if (!books) {
    console.log(
      `BooksByPublisher===> Error, no  books found for (${publisherId}) publisher `,
    );
    return res.status(404).json({
      success: false,
      message: `لا توجد كتب مضافه بواسطة (${publisherId})`,
    });
  }
  res.status(200).json({ success: true, books });
});

exports.getCountOfBooksByPublisherId = asyncHandler(async (req, res) => {
  const publisherId = req.params.id;
  const booksCount = await Book.countDocuments({ addedBy: publisherId });
  if (!booksCount) {
    console.log(
      `CountOfBook===> Error, no  booksCount found for (${publisherId}) publisher `,
    );
  }
  res.status(200).json({ success: true, booksCount });
});

exports.getBooksHaveMoreViews = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 20;

  const books = await Book.find()
    .sort({ views: -1 })
    .limit(limit)
    .populate("category", "name");
  return res.status(200).json(books);
});
