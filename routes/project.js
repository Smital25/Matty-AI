const express = require("express");
const Project = require("../models/Project");
const router = express.Router();

// Save project
router.post("/save", async (req, res) => {
  try {
    const { userId, name, description, data } = req.body;
    const project = new Project({ userId, name, description, data });
    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Load all projects of a user
router.get("/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
