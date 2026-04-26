const mongoose = require("mongoose");
const GeoData = require("../models/GeoData");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/geo-data
const fetchGeoData = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      message: "Please provide lat and lon",
    });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json({
    success: true,
    data,
  });
});

// POST /api/geo-data
const createGeoData = asyncHandler(async (req, res) => {
  const { latitude, longitude, displayName, city, state, country, rawData } =
    req.body;

  if (!latitude || !longitude || !displayName) {
    return res.status(400).json({
      success: false,
      message: "latitude, longitude, and displayName are required",
    });
  }

  const geo = await GeoData.create({
    latitude,
    longitude,
    displayName,
    city,
    state,
    country,
    rawData,
  });

  res.status(201).json({
    success: true,
    data: geo,
  });
});

// GET /api/geo-data/all
const getAllGeoData = asyncHandler(async (req, res) => {
  let query = GeoData.find();

  // SELECT
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // SORT
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  // PAGINATION
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const geoData = await query;

  res.status(200).json({
    success: true,
    count: geoData.length,
    page,
    limit,
    data: geoData,
  });
});

// GET /api/geo-data/:id
const getGeoDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid MongoDB ID",
    });
  }

  const geo = await GeoData.findById(id).select("-__v");

  if (!geo) {
    return res.status(404).json({
      success: false,
      message: "Geo data not found",
    });
  }

  res.status(200).json({
    success: true,
    data: geo,
  });
});

module.exports = {
  fetchGeoData,
  createGeoData,
  getAllGeoData,
  getGeoDataById,
};
