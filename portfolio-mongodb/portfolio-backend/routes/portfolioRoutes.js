import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// GET portfolio data
router.get("/", async (req, res) => {
  try {
    const data = await Portfolio.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; // ✅ default export
