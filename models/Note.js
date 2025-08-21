const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    userId: { type: String, default: "demo-user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
