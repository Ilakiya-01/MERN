const express = require("express");
const MenuItem = require("../db/MenuItem");
const Restaurant = require("../db/Restaurant");
const mongoose = require("mongoose");
const { verifyToken, requireRole } = require("../middleware/auth");
const router = express.Router();

// get menu items for restaurant (public)
router.get("/restaurant/:rid", async (req, res) => {
  const { rid } = req.params;
  let oid = null;
  try {
    oid = new mongoose.Types.ObjectId(rid);
  } catch {}
  // Support both ObjectId and string-typed restaurant fields
  const items = await MenuItem.find({
    $and: [
      {
        $or: [
          oid ? { restaurant: oid } : null,
          { restaurant: rid },
        ].filter(Boolean),
      },
      { available: true },
    ],
  });
  res.json(items);
});

// create menu item (owner must own restaurant)
router.post("/:rid", verifyToken, requireRole("owner"), async (req, res) => {
  const { rid } = req.params;
  const rest = await Restaurant.findById(rid);
  if (!rest) return res.status(404).json({ error: "Restaurant not found" });
  if (rest.owner.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });
  const item = new MenuItem({ ...req.body, restaurant: rid });
  await item.save();
  res.status(201).json(item);
});

// edit/delete similarly (owner check)
router.put("/:id", verifyToken, requireRole("owner"), async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("restaurant");
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (
    item.restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ error: "Forbidden" });
  Object.assign(item, req.body);
  await item.save();
  res.json(item);
});

router.delete("/:id", verifyToken, requireRole("owner"), async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("restaurant");
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (
    item.restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ error: "Forbidden" });
  await item.remove();
  res.json({ message: "Deleted" });
});

module.exports = router;
