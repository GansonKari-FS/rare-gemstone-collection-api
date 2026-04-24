const express = require("express");
const router = express.Router();

// make sure this matches your file name EXACTLY
const {
  fetchGeoData,
  createGeoData,
  getAllGeoData,
  getGeoDataById,
} = require("../controllers/geoControllers");

// GET → fetch from external API (with query params like lat/lon)
router.get("/", fetchGeoData);

// POST → save geo data to MongoDB
router.post("/", createGeoData);

// GET → get all saved geo data from MongoDB
router.get("/all", getAllGeoData);

// GET → get one item by ID
router.get("/:id", getGeoDataById);

module.exports = router;
