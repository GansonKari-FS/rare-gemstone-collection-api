const Gem = require("../models/Gem");
const asyncHandler = require("../middleware/asyncHandler");

const createGem = asyncHandler(async (req, res) => {
  const gem = await Gem.create(req.body);
  res.json(gem);
});

module.exports = { createGem };
