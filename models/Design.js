const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  design: { type: Object, required: true }, // fabric.js JSON data
  createdAt: { type: Date, default: Date.now },
});

const Design = mongoose.model("Design", DesignSchema);
module.exports = Design;
