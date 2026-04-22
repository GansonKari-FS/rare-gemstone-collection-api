const express = require("express");
const morgan = require("morgan");
const messages = require("./messages");

const gemstoneRoutes = require("./routes/gemstoneRoutes");
const certifiedGemstoneRoutes = require("./routes/certifiedGemstoneRoutes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: messages.apiRunning,
    metadata: {
      hostname: req.hostname,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/gemstones", gemstoneRoutes);
app.use("/api/certified-gemstones", certifiedGemstoneRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

module.exports = app;
