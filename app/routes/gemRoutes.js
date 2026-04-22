const express = require("express");
const router = express.Router();

const {
  getAllGems,
  getGemById,
  createGem,
  updateGem,
  deleteGem,
} = require("../controllers/gemController");

router.get("/", getAllGems);
router.get("/:id", getGemById);
router.post("/", createGem);
router.patch("/:id", updateGem);
router.delete("/:id", deleteGem);

module.exports = router;
