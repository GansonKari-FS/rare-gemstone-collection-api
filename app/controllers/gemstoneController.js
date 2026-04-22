const mongoose = require("mongoose");
const Gemstone = require("../models/Gemstone");
const messages = require("../messages");
const asyncHandler = require("../middleware/asyncHandler");

const getAllGemstones = asyncHandler(async (req, res) => {
  const gemstones = await Gemstone.find().select("-__v");

  return res.status(200).json({
    success: true,
    count: gemstones.length,
    message: messages.gemstonesFound,
    data: gemstones,
  });
});

const getGemstoneById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: messages.invalidId,
    });
  }

  const gemstone = await Gemstone.findById(id).select("-__v");

  if (!gemstone) {
    return res.status(404).json({
      success: false,
      message: messages.gemstoneNotFound,
    });
  }

  return res.status(200).json({
    success: true,
    message: messages.gemstoneFound,
    data: gemstone,
  });
});

const createGemstone = asyncHandler(async (req, res) => {
  const { name, color, carat, origin } = req.body;

  if (!name || !color || carat === undefined || !origin) {
    return res.status(400).json({
      success: false,
      message: messages.missingFields,
    });
  }

  const duplicateGemstone = await Gemstone.findOne({
    name: name.trim(),
    color: color.trim(),
    carat,
    origin: origin.trim(),
  });

  if (duplicateGemstone) {
    return res.status(409).json({
      success: false,
      message: "A matching gemstone already exists.",
    });
  }

  const gemstone = await Gemstone.create(req.body);

  return res.status(201).json({
    success: true,
    message: messages.gemstoneCreated,
    data: gemstone,
  });
});

const updateGemstone = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: messages.invalidId,
    });
  }

  const gemstoneExists = await Gemstone.findById(id);

  if (!gemstoneExists) {
    return res.status(404).json({
      success: false,
      message: messages.gemstoneNotFound,
    });
  }

  const updatedGemstone = await Gemstone.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("-__v");

  return res.status(200).json({
    success: true,
    message: messages.gemstoneUpdated,
    data: updatedGemstone,
  });
});

const deleteGemstone = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: messages.invalidId,
    });
  }

  const gemstone = await Gemstone.findById(id);

  if (!gemstone) {
    return res.status(404).json({
      success: false,
      message: messages.gemstoneNotFound,
    });
  }

  await gemstone.deleteOne();

  return res.status(200).json({
    success: true,
    message: messages.gemstoneDeleted,
  });
});

module.exports = {
  getAllGemstones,
  getGemstoneById,
  createGemstone,
  updateGemstone,
  deleteGemstone,
};
