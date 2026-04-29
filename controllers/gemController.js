const mongoose = require("mongoose");
const Gem = require("../models/Gem");
const asyncHandler = require("../middleware/asyncHandler");
const messages = require("../messages");

// GET ALL GEMS
const getAllGems = asyncHandler(async (req, res) => {
  const gems = await Gem.find().select("-__v");

  res.status(200).json({
    success: true,
    data: gems,
  });
});

// GET BY ID
const getGemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  const gem = await Gem.findById(id).select("-__v");

  if (!gem) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  res.status(200).json({
    success: true,
    data: gem,
  });
});

// CREATE GEM (SAFE + CLEAN)
const createGem = asyncHandler(async (req, res) => {
  try {
    const { name, color, carat, origin, rarity, inStock } = req.body;

    const gem = await Gem.create({
      name,
      color,
      carat: Number(carat),
      origin,
      rarity,
      inStock: inStock ?? true,
    });

    res.status(201).json({
      success: true,
      data: gem,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// UPDATE GEM
const updateGem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const gem = await Gem.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: gem,
  });
});

// DELETE GEM
const deleteGem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Gem.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Deleted",
  });
});

module.exports = {
  getAllGems,
  getGemById,
  createGem,
  updateGem,
  deleteGem,
};
