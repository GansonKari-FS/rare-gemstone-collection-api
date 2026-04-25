const mongoose = require("mongoose");
const GeoData = require("../models/GeoData");
const asyncHandler = require("../middleware/asyncHandler");

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

const getAllGeoData = asyncHandler(async (req, res) => {
  const geoData = await GeoData.find();

  res.status(200).json({
    success: true,
    count: geoData.length,
    data: geoData,
  });
});

const getGeoDataById = asyncHandler(async (req, res) => {
  const geo = await GeoData.findById(req.params.id);

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
