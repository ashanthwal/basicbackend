const mongoose = require("mongoose");

const collectionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Collections", collectionsSchema);
