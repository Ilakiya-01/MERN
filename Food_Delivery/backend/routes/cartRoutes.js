const express = require("express");
const Cart = require("../db/Cart");
const MenuItem = require("../db/MenuItem");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// ----------------- GET CART -----------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- ADD ITEM -----------------
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    if (!itemId) return res.status(400).json({ error: "itemId required" });

    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) return res.status(404).json({ error: "Item not found" });

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existing = cart.items.find((i) => i.item.toString() === itemId);
    if (existing) {
      existing.qty += qty || 1;
    } else {
      cart.items.push({
        item: itemId,
        name: menuItem.name,
        price: menuItem.price,
        qty: qty || 1,
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- UPDATE QTY -----------------
router.put("/update/:itemId", verifyToken, async (req, res) => {
  try {
    const { qty } = req.body;
    if (qty < 1) return res.status(400).json({ error: "Invalid quantity" });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (i) => i.item.toString() === req.params.itemId
    );
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.qty = qty;
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- REMOVE ITEM -----------------
router.delete("/remove/:itemId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.item.toString() !== req.params.itemId
    );
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- CLEAR CART -----------------
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } },
      { new: true }
    );
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
