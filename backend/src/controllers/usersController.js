const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const mongoose = require("mongoose");
const isObjectId = mongoose.Types.ObjectId;
exports.getUsers = asyncHandler(async (req, res) => {
  const filter = req.query.filter;
  const searchValue = req.query.search;
  let filterValue;
  if (filter) {
    if (filter == "banned" || filter == "active")
      filterValue = { status: filter };
    else if (filter == "admin" || filter == "publisher" || filter == "user")
      filterValue = { role: filter };
    else filterValue = { role: "user" };
    console.log(filterValue);
    const users = await User.find(filterValue).sort({ createdAt: -1 });
    console.log(users);

    res.status(200).json(users);
  } else if (searchValue) {
    const searchWays = [
      {
        $text: { $search: searchValue },
      },
    ];
    if (isObjectId.isValid(searchValue)) searchWays[0] = { _id: searchValue };
    else searchWays[0] = { $text: { $search: searchValue } };
    const users = await User.find({ $or: searchWays }).sort({ createdAt: -1 });
    console.log(users);
    res.status(200).json(users);
  } else {
    console.log(filterValue);
    const users = await User.find().sort({ createdAt: -1 });
    console.log(users);

    res.status(200).json(users);
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ user });
});
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userData._id);
  console.log(user);
  res.status(200).json({ user });
});

exports.makeUserPublisher = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.role = "publisher";
  await user.save();
  res.status(200).json({ user });
});

exports.makeUserNormalUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.role = "user";
  await user.save();
  res.status(200).json({ user });
});

exports.makeUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.role = "admin";
  await user.save();
  res.status(200).json({ user });
});

exports.banUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  const status = req.body.status;
  user.status = status;
  await user.save();
  console.log(user);
  res.status(200).json({ user });
});

exports.countUsers = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  console.log("countUsers", count);
  res.status(200).json({ count });
});
