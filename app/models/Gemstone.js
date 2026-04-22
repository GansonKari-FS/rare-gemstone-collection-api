const mongoose = require("mongoose");

const gemstoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Gemstone name is required."],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Gemstone color is required."],
      trim: true,
    },
    carat: {
      type: Number,
      required: [true, "Carat is required."],
      min: [0.01, "Carat must be greater than 0."],
    },
    origin: {
      type: String,
      required: [true, "Origin is required."],
      trim: true,
    },
    rarity: {
      type: String,
      enum: ["Common", "Uncommon", "Rare", "Very Rare"],
      default: "Rare",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Gemstone", gemstoneSchema);
