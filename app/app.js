const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let gems = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.get("/api/gems/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "gem route works",
  });
});

app.get("/api/gems", (req, res) => {
  res.status(200).json({
    success: true,
    count: gems.length,
    data: gems,
  });
});

app.get("/api/gems/:id", (req, res) => {
  const gem = gems.find((g) => g.id === Number(req.params.id));

  if (!gem) {
    return res.status(404).json({
      success: false,
      message: "Gem not found",
    });
  }

  res.status(200).json({
    success: true,
    data: gem,
  });
});

app.post("/api/gems", (req, res) => {
  const { name, color, carat, origin, treatment, price, inStock } = req.body;

  if (!name || !color || !carat || !origin || !price) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const newGem = {
    id: nextId++,
    name,
    color,
    carat,
    origin,
    treatment: treatment || "None",
    price,
    inStock: inStock ?? true,
  };

  gems.push(newGem);

  res.status(201).json({
    success: true,
    message: "Gem created successfully",
    data: newGem,
  });
});

app.patch("/api/gems/:id", (req, res) => {
  const gem = gems.find((g) => g.id === Number(req.params.id));

  if (!gem) {
    return res.status(404).json({
      success: false,
      message: "Gem not found",
    });
  }

  Object.assign(gem, req.body);

  res.status(200).json({
    success: true,
    message: "Gem updated successfully",
    data: gem,
  });
});

app.delete("/api/gems/:id", (req, res) => {
  const index = gems.findIndex((g) => g.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Gem not found",
    });
  }

  const deletedGem = gems.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Gem deleted successfully",
    data: deletedGem,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
