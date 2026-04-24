const express = require("express");
const router = express.Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controllers/certifiedGemstoneController");

router.route("/").get(getAll).post(create);

router.route("/:id").get(getById).patch(update).delete(remove);

module.exports = router;
