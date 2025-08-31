import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// GET portfolio data
// routes/portfolioRoutes.js
router.get("/", async (req, res) => {
  try {
    const data = await Portfolio.findOne(); // returns the first document
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
