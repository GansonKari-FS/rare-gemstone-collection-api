const mongoose = require("mongoose");

const certifiedSchema = new mongoose.Schema({
  certificationLab: String,
  certificateNumber: String,
  appraisalValue: Number,
  isLabCreated: Boolean,
  gemstone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gem",
  },
});

module.exports = mongoose.model("CertifiedGemstone", certifiedSchema);
