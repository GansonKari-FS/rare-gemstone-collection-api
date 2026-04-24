const mongoose = require("mongoose");
const CertifiedGemstone = require("../models/CertifiedGemstone");
const asyncHandler = require("../middleware/asyncHandler");
const messages = require("../messages");

const getAll = asyncHandler(async (req, res) => {
  const data = await CertifiedGemstone.find()
    .populate("gemstone")
    .select("-__v");

  res.json(data);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: messages.invalidId });
  }

  const item = await CertifiedGemstone.findById(id).populate("gemstone");

  if (!item) {
    return res
      .status(404)
      .json({ message: messages.certifiedGemstoneNotFound });
  }

  res.json(item);
});

const create = asyncHandler(async (req, res) => {
  const item = await CertifiedGemstone.create(req.body);
  res.json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await CertifiedGemstone.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await CertifiedGemstone.findByIdAndDelete(req.params.id);
  res.json({ message: messages.certifiedGemstoneDeleted });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
