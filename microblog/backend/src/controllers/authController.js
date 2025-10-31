const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET = process.env.JWT_SECRET || "dev_secret";

// Register new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email already used" });
  if (await User.findOne({ username }))
    return res.status(400).json({ message: "Username taken" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const refreshToken = jwt.sign({ sub: user._id }, SECRET, {
      expiresIn: "30d",
    });
    user.refreshToken = refreshToken;
    await user.save();

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User creation failed" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
  const refreshToken = jwt.sign({ sub: user._id }, SECRET, {
    expiresIn: "30d",
  });
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    user: { id: user._id, username: user.username, email: user.email },
    token,
    refreshToken,
  });
};

// Refresh JWT token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(refreshToken, SECRET);
    const user = await User.findOne({ _id: payload.sub, refreshToken });
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: "Refresh token invalid or expired" });
  }
};
