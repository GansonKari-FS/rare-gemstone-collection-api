const mongoose = require("mongoose");
const Gem = require("../models/Gem");
const asyncHandler = require("../middleware/asyncHandler");
const messages = require("../messages");

// GET ALL (UPDATED WITH FILTER + SELECT + SORT)
const getAllGems = asyncHandler(async (req, res) => {
  // 1. Copy query object
  let queryObj = { ...req.query };

  // 2. Remove special fields
  const removeFields = ["select", "sort"];
  removeFields.forEach((field) => delete queryObj[field]);

  // 3. Convert to string
  let queryStr = JSON.stringify(queryObj);

  // 4. Add $ to operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );

  // 5. Create query
  let query = Gem.find(JSON.parse(queryStr));

  // 6. Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // 7. Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  // 8. Execute
  const gems = await query;

  res.status(200).json({
    success: true,
    count: gems.length,
    data: gems,
  });
});

// GET BY ID
const getGemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const gem = await Gem.findById(id).select("-__v");

  if (!gem) {
    return res.status(404).json({ message: messages.gemstoneNotFound });
  }

  res.json(gem);
});

// CREATE
const createGem = asyncHandler(async (req, res) => {
  const gem = await Gem.create(req.body);
  res.status(201).json(gem);
});

// UPDATE
const updateGem = asyncHandler(async (req, res) => {
  const gem = await Gem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(gem);
});

// DELETE
const deleteGem = asyncHandler(async (req, res) => {
  await Gem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = {
  getAllGems,
  getGemById,
  createGem,
  updateGem,
  deleteGem,
};
