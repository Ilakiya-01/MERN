const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const jwt = require("jsonwebtoken");

// Middleware: verify token & role
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// GET portfolio (public)
router.get("/", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio" });
  }
});

// UPDATE portfolio (admin only)
router.put("/", protect, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = new Portfolio(req.body);
    } else {
      Object.assign(portfolio, req.body);
    }
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error updating portfolio" });
  }
});

module.exports = router;
