const express = require("express");
const app = express();

const gemRoutes = require("../routes/gemRoutes");
const certifiedGemstoneRoutes = require("../routes/certifiedGemstoneRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/gemstones", gemRoutes);
app.use("/api/certified-gemstones", certifiedGemstoneRoutes);

module.exports = app;
