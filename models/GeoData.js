const mongoose = require("mongoose");

const geoDataSchema = new mongoose.Schema(
  {
    searchType: {
      type: String,
      default: "reverse-geocode",
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "Unknown",
    },
    state: {
      type: String,
      default: "Unknown",
    },
    country: {
      type: String,
      default: "Unknown",
    },
    sourceApi: {
      type: String,
      default: "OpenStreetMap Nominatim",
    },
    rawData: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("GeoData", geoDataSchema);
