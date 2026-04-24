const express = require("express");
const router = express.Router();

const {
  getAllGems,
  getGemById,
  createGem,
  updateGem,
  deleteGem,
} = require("../controllers/gemController");

router.route("/").get(getAllGems).post(createGem);

router.route("/:id").get(getGemById).patch(updateGem).delete(deleteGem);

module.exports = router;
