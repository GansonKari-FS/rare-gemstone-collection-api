const Gem = require("../models/Gem");

const getAllGems = async (req, res) => {
  try {
    const gems = await Gem.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gems.length,
      data: gems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gems",
      error: error.message,
    });
  }
};

const getGemById = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: "Gem not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gem",
      error: error.message,
    });
  }
};

const createGem = async (req, res) => {
  try {
    const gem = await Gem.create(req.body);

    res.status(201).json({
      success: true,
      message: "Gem created successfully",
      data: gem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create gem",
      error: error.message,
    });
  }
};

const updateGem = async (req, res) => {
  try {
    const gem = await Gem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: "Gem not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gem updated successfully",
      data: gem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update gem",
      error: error.message,
    });
  }
};

const deleteGem = async (req, res) => {
  try {
    const gem = await Gem.findByIdAndDelete(req.params.id);

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: "Gem not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gem deleted successfully",
      data: gem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete gem",
      error: error.message,
    });
  }
};

module.exports = {
  getAllGems,
  getGemById,
  createGem,
  updateGem,
  deleteGem,
};
