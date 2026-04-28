const express = require("express");
const cors = require("cors");
const app = express();

const gemRoutes = require("../routes/gemRoutes");
const certifiedGemstoneRoutes = require("../routes/certifiedGemstoneRoutes");
const geoRoutes = require("../routes/geoRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/gemstones", gemRoutes);
app.use("/api/certified-gemstones", certifiedGemstoneRoutes);
app.use("/api/geo-data", geoRoutes);

module.exports = app;
