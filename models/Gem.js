const mongoose = require("mongoose");

const gemSchema = new mongoose.Schema({
  name: String,
  color: String,
  carat: Number,
  origin: String,
  rarity: String,
  inStock: Boolean,
});

module.exports = mongoose.model("Gem", gemSchema);
