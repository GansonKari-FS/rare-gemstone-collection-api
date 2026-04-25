const mongoose = require("mongoose");
const Gem = require("../models/Gem");
const asyncHandler = require("../middleware/asyncHandler");
const messages = require("../messages");

// GET ALL GEMS
// Includes filtering, Mongo query operators, select, sort, and pagination
const getAllGems = asyncHandler(async (req, res) => {
  let queryObj = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((field) => delete queryObj[field]);

  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );

  let query = Gem.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const gems = await query;
  const total = await Gem.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    success: true,
    count: gems.length,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    data: gems,
  });
});

// GET GEM BY ID
const getGemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const gem = await Gem.findById(id).select("-__v");

  if (!gem) {
    return res.status(404).json({ message: messages.gemstoneNotFound });
  }

  res.status(200).json({
    success: true,
    data: gem,
  });
});

// CREATE GEM
const createGem = asyncHandler(async (req, res) => {
  const gem = await Gem.create(req.body);

  res.status(201).json({
    success: true,
    message: messages.gemstoneCreated,
    data: gem,
  });
});

// UPDATE GEM
const updateGem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const gemExists = await Gem.findById(id);

  if (!gemExists) {
    return res.status(404).json({ message: messages.gemstoneNotFound });
  }

  const updatedGem = await Gem.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("-__v");

  res.status(200).json({
    success: true,
    message: messages.gemstoneUpdated,
    data: updatedGem,
  });
});

// DELETE GEM
const deleteGem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const gem = await Gem.findById(id);

  if (!gem) {
    return res.status(404).json({ message: messages.gemstoneNotFound });
  }

  await gem.deleteOne();

  res.status(200).json({
    success: true,
    message: messages.gemstoneDeleted,
  });
});

module.exports = {
  getAllGems,
  getGemById,
  createGem,
  updateGem,
  deleteGem,
};
