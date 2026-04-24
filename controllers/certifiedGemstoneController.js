const mongoose = require("mongoose");
const CertifiedGemstone = require("../models/CertifiedGemstone");
const Gem = require("../models/Gem");
const asyncHandler = require("../middleware/asyncHandler");

// GET ALL (UPDATED WITH FILTER + SELECT + SORT)
const getAll = asyncHandler(async (req, res) => {
  let queryObj = { ...req.query };

  const removeFields = ["select", "sort"];
  removeFields.forEach((field) => delete queryObj[field]);

  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );

  let query = CertifiedGemstone.find(JSON.parse(queryStr)).populate({
    path: "gemstone",
    select: "name color carat origin",
  });

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

  const results = await query;

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

// GET BY ID
const getById = asyncHandler(async (req, res) => {
  const item = await CertifiedGemstone.findById(req.params.id).populate(
    "gemstone",
  );
  res.json(item);
});

// CREATE
const create = asyncHandler(async (req, res) => {
  const item = await CertifiedGemstone.create(req.body);
  res.status(201).json(item);
});

// UPDATE
const update = asyncHandler(async (req, res) => {
  const item = await CertifiedGemstone.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.json(item);
});

// DELETE
const remove = asyncHandler(async (req, res) => {
  await CertifiedGemstone.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
