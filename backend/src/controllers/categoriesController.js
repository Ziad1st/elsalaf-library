const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ order: 1 });
  res.status(200).json(categories);
});

const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ApiError("الفئة غير موجودة", 404));
  res.status(200).json({ category });
});

const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, order } = req.body;

  console.log(req.body);

  if (!name || !description || order === undefined) {
    return next(new ApiError("يرجى ادخال الاسم و الوصف و الترتيب", 400));
  }

  const category = await Category.create({ name, description, order });
  res.status(201).json({ category });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return next(new ApiError("الفئة غير موجودة", 404));
  res.status(200).json({ category });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const deletedCategory = await Category.findByIdAndDelete(req.params.id);
  if (!deletedCategory) return next(new ApiError("الفئة غير موجودة", 404));
  res.status(200).json({ deletedCategory });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
