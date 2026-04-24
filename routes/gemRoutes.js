const express = require("express");
const router = express.Router();
const { createGem } = require("../controllers/gemController");

router.post("/", createGem);

module.exports = router;
