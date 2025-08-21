const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true },
    meta: { type: Object, default: {} },
    userId: { type: String, default: "demo-user" },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
