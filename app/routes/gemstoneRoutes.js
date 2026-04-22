const express = require("express");
const router = express.Router();

const {
  getAllGemstones,
  getGemstoneById,
  createGemstone,
  updateGemstone,
  deleteGemstone,
} = require("../controllers/gemstoneController");

router.route("/").get(getAllGemstones).post(createGemstone);

router
  .route("/:id")
  .get(getGemstoneById)
  .patch(updateGemstone)
  .delete(deleteGemstone);

module.exports = router;