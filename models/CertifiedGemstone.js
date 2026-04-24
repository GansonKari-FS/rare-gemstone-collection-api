const mongoose = require("mongoose");

const certifiedGemstoneSchema = new mongoose.Schema(
  {
    certificationLab: {
      type: String,
      required: [true, "Certification lab is required."],
      trim: true,
    },
    certificateNumber: {
      type: String,
      required: [true, "Certificate number is required."],
      trim: true,
    },
    appraisalValue: {
      type: Number,
      required: [true, "Appraisal value is required."],
    },
    isLabCreated: {
      type: Boolean,
      default: false,
    },
    gemstone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gem",
      required: [true, "Gemstone id is required."],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CertifiedGemstone", certifiedGemstoneSchema);
