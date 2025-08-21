const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// Get activity
router.get("/", async (req, res) => {
  try {
    const { limit = 20, userId = "demo-user" } = req.query;
    const items = await Activity.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

// Create activity
router.post("/", async (req, res) => {
  try {
    const { action, meta = {}, userId = "demo-user" } = req.body;
    if (!action?.trim()) {
      return res.status(400).json({ error: "action is required" });
    }
    const item = await Activity.create({ action: action.trim(), meta, userId });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to create activity" });
  }
});

// Delete activity
router.delete("/:id", async (req, res) => {
  try {
    const item = await Activity.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Activity not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete activity" });
  }
});

module.exports = router;
