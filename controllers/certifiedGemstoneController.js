const mongoose = require("mongoose");
const CertifiedGemstone = require("../models/CertifiedGemstone");
const Gem = require("../models/Gem");
const asyncHandler = require("../middleware/asyncHandler");
const messages = require("../messages");

// GET ALL CERTIFIED GEMSTONES
// Includes filtering, Mongo query operators, select, sort, populate, and pagination
const getAll = asyncHandler(async (req, res) => {
  let queryObj = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((field) => delete queryObj[field]);

  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );

  let query = CertifiedGemstone.find(JSON.parse(queryStr)).populate({
    path: "gemstone",
    select: "name color carat origin rarity inStock",
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

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const certifiedGemstones = await query;
  const total = await CertifiedGemstone.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    success: true,
    count: certifiedGemstones.length,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    data: certifiedGemstones,
  });
});

// GET CERTIFIED GEMSTONE BY ID
const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const item = await CertifiedGemstone.findById(id)
    .populate({
      path: "gemstone",
      select: "name color carat origin rarity inStock",
    })
    .select("-__v");

  if (!item) {
    return res.status(404).json({
      success: false,
      message: messages.certifiedGemstoneNotFound,
    });
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// CREATE CERTIFIED GEMSTONE
const create = asyncHandler(async (req, res) => {
  const {
    certificationLab,
    certificateNumber,
    appraisalValue,
    isLabCreated,
    gemstone,
  } = req.body;

  if (
    !certificationLab ||
    !certificateNumber ||
    appraisalValue === undefined ||
    !gemstone
  ) {
    return res.status(400).json({
      success: false,
      message: messages.missingFields,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(gemstone)) {
    return res.status(400).json({
      success: false,
      message: messages.invalidId,
    });
  }

  const gemExists = await Gem.findById(gemstone);

  if (!gemExists) {
    return res.status(404).json({
      success: false,
      message: messages.gemstoneNotFound,
    });
  }

  const item = await CertifiedGemstone.create({
    certificationLab,
    certificateNumber,
    appraisalValue,
    isLabCreated,
    gemstone,
  });

  const populatedItem = await CertifiedGemstone.findById(item._id)
    .populate({
      path: "gemstone",
      select: "name color carat origin rarity inStock",
    })
    .select("-__v");

  res.status(201).json({
    success: true,
    message: messages.certifiedGemstoneCreated,
    data: populatedItem,
  });
});

// UPDATE CERTIFIED GEMSTONE
const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { gemstone } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const itemExists = await CertifiedGemstone.findById(id);

  if (!itemExists) {
    return res.status(404).json({
      success: false,
      message: messages.certifiedGemstoneNotFound,
    });
  }

  if (gemstone) {
    if (!mongoose.Types.ObjectId.isValid(gemstone)) {
      return res.status(400).json({ message: messages.invalidId });
    }

    const gemExists = await Gem.findById(gemstone);

    if (!gemExists) {
      return res.status(404).json({
        success: false,
        message: messages.gemstoneNotFound,
      });
    }
  }

  const updatedItem = await CertifiedGemstone.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate({
      path: "gemstone",
      select: "name color carat origin rarity inStock",
    })
    .select("-__v");

  res.status(200).json({
    success: true,
    message: messages.certifiedGemstoneUpdated,
    data: updatedItem,
  });
});

// DELETE CERTIFIED GEMSTONE
const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const item = await CertifiedGemstone.findById(id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: messages.certifiedGemstoneNotFound,
    });
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: messages.certifiedGemstoneDeleted,
  });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
