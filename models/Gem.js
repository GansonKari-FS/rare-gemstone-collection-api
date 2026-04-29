const mongoose = require("mongoose");

const gemstoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  carat: { type: Number, required: true },
  origin: { type: String, required: true },
  rarity: { type: String, required: true },
  inStock: { type: Boolean, default: true },
});

module.exports = mongoose.model("Gemstone", gemstoneSchema);
