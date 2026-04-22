const mongoose = require("mongoose");

const gemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Gem name is required"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    carat: {
      type: Number,
      required: [true, "Carat is required"],
    },
    origin: {
      type: String,
      required: [true, "Origin is required"],
      trim: true,
    },
    treatment: {
      type: String,
      default: "None",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
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

module.exports = mongoose.model("Gem", gemSchema);
