const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/User");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ error: "User exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hash,
      role: role || "user",
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: u._id, role: u.role, username: u.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.json({
      token,
      user: { id: u._id, username: u.username, role: u.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get current user profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select("username email role address createdAt updatedAt");
    res.json(u);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// update current user profile (username, address)
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { username, address } = req.body;
    const u = await User.findById(req.user.id);
    if (!u) return res.status(404).json({ error: "Not found" });
    if (typeof username === "string" && username.trim()) u.username = username.trim();
    if (typeof address === "string") u.address = address;
    await u.save();
    res.json({ id: u._id, username: u.username, email: u.email, role: u.role, address: u.address });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
