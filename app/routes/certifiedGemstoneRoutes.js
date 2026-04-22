const express = require("express");
const router = express.Router();

const {
  getAllCertifiedGemstones,
  getCertifiedGemstoneById,
  createCertifiedGemstone,
  updateCertifiedGemstone,
  deleteCertifiedGemstone,
} = require("../controllers/certifiedGemstoneController");

router.route("/").get(getAllCertifiedGemstones).post(createCertifiedGemstone);

router
  .route("/:id")
  .get(getCertifiedGemstoneById)
  .patch(updateCertifiedGemstone)
  .delete(deleteCertifiedGemstone);

module.exports = router;
