const express = require("express");
const router = express.Router();
const Design = require("../models/Design");

// ✅ Save design
router.post("/", async (req, res) => {
  try {
    const { userId, design } = req.body;

    if (!userId || !design) {
      return res.status(400).json({ error: "userId and design are required" });
    }

    const newDesign = new Design({ userId, design });
    await newDesign.save();

    res.status(201).json({ message: "✅ Design saved successfully!", design: newDesign });
  } catch (err) {
    console.error("Save design error:", err);
    res.status(500).json({ error: "Failed to save design" });
  }
});

// ✅ Get all designs for a user
router.get("/:userId", async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(designs);
  } catch (err) {
    console.error("Fetch designs error:", err);
    res.status(500).json({ error: "Failed to fetch designs" });
  }
});

module.exports = router;
