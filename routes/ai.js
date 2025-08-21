// routes/ai.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Call FastAPI service
    const fastapiRes = await axios.post("http://127.0.0.1:8000/generate", {
      prompt,
    });

    res.json({ output: fastapiRes.data.output });
  } catch (err) {
    console.error("Error communicating with FastAPI:", err.message);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

module.exports = router;
