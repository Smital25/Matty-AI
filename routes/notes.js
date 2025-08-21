const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const Activity = require("../models/Activity");

// Get notes
router.get("/", async (req, res) => {
  try {
    const { limit = 50, userId = "demo-user" } = req.query;
    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create note
router.post("/", async (req, res) => {
  try {
    const { text, userId = "demo-user" } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "text is required" });
    }
    const note = await Note.create({ text: text.trim(), userId });

    await Activity.create({
      action: "Saved a new note",
      meta: { noteId: note._id, preview: note.text.slice(0, 80) },
      userId
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to save note" });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    await Activity.create({
      action: "Deleted a note",
      meta: { noteId: req.params.id, preview: note.text.slice(0, 80) },
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
