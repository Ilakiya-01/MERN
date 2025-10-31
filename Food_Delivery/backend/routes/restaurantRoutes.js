const express = require("express");
const Restaurant = require("../db/Restaurant");
const { verifyToken, requireRole } = require("../middleware/auth");
const router = express.Router();

// public list + search
router.get("/", async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.categories = category;
  const list = await Restaurant.find(filter).limit(50);
  res.json(list);
});

// create restaurant (owner)
router.post("/", verifyToken, requireRole("owner"), async (req, res) => {
  try {
    const r = new Restaurant({ ...req.body, owner: req.user.id });
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ error: "Server" });
  }
});

// owner: list own restaurants
router.get("/mine", verifyToken, requireRole("owner"), async (req, res) => {
  const list = await Restaurant.find({ owner: req.user.id });
  res.json(list);
});

// get restaurant by id (public)
router.get("/:rid", async (req, res) => {
  const r = await Restaurant.findById(req.params.rid);
  if (!r) return res.status(404).json({ error: "Not found" });
  res.json(r);
});

// update restaurant (owner/admin only, must own)
router.put("/:rid", verifyToken, requireRole("owner"), async (req, res) => {
  const r = await Restaurant.findById(req.params.rid);
  if (!r) return res.status(404).json({ error: "Not found" });
  if (r.owner.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });
  const { name, description, location, categories } = req.body;
  if (typeof name === "string" && name.trim()) r.name = name.trim();
  if (typeof description === "string") r.description = description;
  if (typeof location === "string") r.location = location;
  if (Array.isArray(categories)) r.categories = categories;
  await r.save();
  res.json(r);
});

module.exports = router;
