const express = require("express");
const Order = require("../db/Order");
const Restaurant = require("../db/Restaurant");
const MenuItem = require("../db/MenuItem");
const { verifyToken, requireRole } = require("../middleware/auth");
const router = express.Router();

// place order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;
    // items: [{ itemId, qty }]
    if (!items || !items.length)
      return res.status(400).json({ error: "No items" });

    const menuItems = await MenuItem.find({
      _id: { $in: items.map((i) => i.itemId) },
    });
    const map = {};
    menuItems.forEach((mi) => (map[mi._id.toString()] = mi));

    const orderItems = items.map((i) => {
      const mi = map[i.itemId];
      return { item: mi._id, name: mi.name, price: mi.price, qty: i.qty || 1 };
    });

    const subtotal = orderItems.reduce((s, it) => s + it.price * it.qty, 0);

    const order = new Order({
      customer: req.user.id,
      restaurant: restaurantId,
      items: orderItems,
      subtotal,
      deliveryAddress: deliveryAddress || req.user.address,
    });
    await order.save();
    // notify owner/customer via Socket.IO
    const io = req.app.get("io");
    io.to(`restaurant_${restaurantId}`).emit("orderUpdated", order);
    io.to(`customer_${req.user.id}`).emit("orderUpdated", order);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// restaurant owner fetch orders for their restaurants
router.get(
  "/restaurant/:rid",
  verifyToken,
  requireRole("owner"),
  async (req, res) => {
    const rid = req.params.rid;
    const rest = await Restaurant.findById(rid);
    if (!rest) return res.status(404).json({ error: "Not found" });
    if (rest.owner.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    const orders = await Order.find({ restaurant: rid }).sort({
      createdAt: -1,
    });
    res.json(orders);
  }
);

// basic analytics for a restaurant (owner)
router.get(
  "/restaurant/:rid/analytics",
  verifyToken,
  requireRole("owner"),
  async (req, res) => {
    const rid = req.params.rid;
    const rest = await Restaurant.findById(rid);
    if (!rest) return res.status(404).json({ error: "Not found" });
    if (rest.owner.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const orders = await Order.find({ restaurant: rid });
    const byStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    const revenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + (o.subtotal || 0), 0);
    res.json({ count: orders.length, byStatus, revenue });
  }
);

// owner update order status
router.put(
  "/:id/status",
  verifyToken,
  requireRole("owner"),
  async (req, res) => {
    const order = await Order.findById(req.params.id).populate("restaurant");
    if (!order) return res.status(404).json({ error: "Not found" });
    if (
      order.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    )
      return res.status(403).json({ error: "Forbidden" });
    const { status } = req.body;
    order.status = status;
    await order.save();

    // Emit socket event to customers and owner rooms (see index.js)
    const io = req.app.get("io");
    io.to(`restaurant_${order.restaurant._id}`).emit("orderUpdated", order);
    io.to(`customer_${order.customer}`).emit("orderUpdated", order);

    res.json(order);
  }
);

// customer: get own orders
router.get("/mine", verifyToken, async (req, res) => {
  const orders = await Order.find({ customer: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

module.exports = router;
