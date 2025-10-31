import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// GET portfolio data
<<<<<<< HEAD
// routes/portfolioRoutes.js
router.get("/", async (req, res) => {
  try {
    const data = await Portfolio.findOne(); // returns the first document
    res.json(data || {});
=======
router.get("/", async (req, res) => {
  try {
    const data = await Portfolio.findOne();
    res.json(data);
>>>>>>> 2095dc6aefdade4f746c055b30f493856505867f
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
export default router;
=======
export default router; // ✅ default export
>>>>>>> 2095dc6aefdade4f746c055b30f493856505867f
