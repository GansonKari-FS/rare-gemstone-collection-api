const mongoose = require("mongoose");
const CertifiedGemstone = require("../models/CertifiedGemstone");
const Gemstone = require("../models/Gemstone");
const messages = require("../messages");
const asyncHandler = require("../middleware/asyncHandler");

const getAllCertifiedGemstones = asyncHandler(async (req, res) => {
  const certifiedGemstones = await CertifiedGemstone.find()
    .populate({
      path: "gemstone",
      select: "name color carat origin rarity inStock",
    })
    .select("-__v");

  return res.status(200).json({
    success: true,
    count: certifiedGemstones.length,
    message: messages.certifiedGemstonesFound,
    data: certifiedGemstones,
  });
});

const getCertifiedGemstoneById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: messages.invalidId,
    });
  }

  const certifiedGemstone = await CertifiedGemstone.findById(id)
    .populate({
      path: "gemstone",
      select: "name color carat origin rarity inStock",
    })
    .select("-__v");

  if (!certifiedGemstone) {
    return res.status(404).json({
      success: false,
      message: messages.certifiedGemstoneNotFound,
    });
  }

  return res.status(200).json({
    success: true,
    message: messages.certifiedGemstoneFound,
    data: certifiedGemstone,
  });
});

const createCertifiedGemstone = asyncHandler(async (req, res) => {
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
      message: "The gemstone id provided is not valid.",
    });
  }

  const gemstoneExists = await Gemstone.findById(gemstone);

  if (!gemstoneExists) {
    return res.status(404).json({
      success: false,
      message: messages.gemstoneNotFound,
    });
  }

  const duplicateCertifiedGemstone = await CertifiedGemstone.findOne({
    certificateNumber: certificateNumber.trim(),
  });

  if (duplicateCertifiedGemstone) {
    return res.status(409).json({
      success: false,
      message: "That certificate number already exists.",
    });
  }

  const certifiedGemstone = await CertifiedGemstone.create({
    certificationLab,
    certificateNumber,
    appraisalValue,
    isLabCreated,
    gemstone,
  });

  const populatedCertifiedGemstone = await CertifiedGemstone.findById(
    certifiedGemstone._id,
  )
    .populate({
      path: "gemstone",
      select: "name color carat origin rarity inStock",
    })
    .select("-__v");

  return res.status(201).json({
    success: true,
    message: messages.certifiedGemstoneCreated,
    data: populatedCertifiedGemstone,
  });
});

const updateCertifiedGemstone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { gemstone, certificateNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: messages.invalidId,
    });
  }

  const certifiedGemstoneExists = await CertifiedGemstone.findById(id);

  if (!certifiedGemstoneExists) {
    return res.status(404).json({
      success: false,
      message: messages.certifiedGemstoneNotFound,
    });
  }

  if (gemstone) {
    if (!mongoose.Types.ObjectId.isValid(gemstone)) {
      return res.status(400).json({
        success: false,
        message: "The gemstone id provided is not valid.",
      });
    }

    const gemstoneExists = await Gemstone.findById(gemstone);

    if (!gemstoneExists) {
      return res.status(404).json({
        success: false,
        message: messages.gemstoneNotFound,
      });
    }
  }

  if (certificateNumber) {
    const duplicateCertificate = await CertifiedGemstone.findOne({
      certificateNumber: certificateNumber.trim(),
      _id: { $ne: id },
    });

    if (duplicateCertificate) {
      return res.status(409).json({
        success: false,
        message: "That certificate number already exists.",
      });
    }
  }

  const updatedCertifiedGemstone = await CertifiedGemstone.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate({
      path: "gemstone",
      select: "name color carat origin rarity inStock",
    })
    .select("-__v");

  return res.status(200).json({
    success: true,
    message: messages.certifiedGemstoneUpdated,
    data: updatedCertifiedGemstone,
  });
});

const deleteCertifiedGemstone = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: messages.invalidId,
    });
  }

  const certifiedGemstone = await CertifiedGemstone.findById(id);

  if (!certifiedGemstone) {
    return res.status(404).json({
      success: false,
      message: messages.certifiedGemstoneNotFound,
    });
  }

  await certifiedGemstone.deleteOne();

  return res.status(200).json({
    success: true,
    message: messages.certifiedGemstoneDeleted,
  });
});

module.exports = {
  getAllCertifiedGemstones,
  getCertifiedGemstoneById,
  createCertifiedGemstone,
  updateCertifiedGemstone,
  deleteCertifiedGemstone,
};
