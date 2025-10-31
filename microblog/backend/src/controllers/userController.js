const User = require("../models/User");
const Post = require("../models/Post");

// Get user profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers following", "username avatarUrl");
  if (!user) return res.status(404).json({ message: "User not found" });

  const posts = await Post.find({ author: user._id })
    .populate("author", "username avatarUrl")
    .sort({ createdAt: -1 });

  res.json({ ...user.toObject(), posts });
};

// Update own profile
exports.updateMe = async (req, res) => {
  const { username, bio, avatarUrl } = req.body;
  const updates = {};
  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

  if (updates.username) {
    const existing = await User.findOne({
      username: updates.username,
      _id: { $ne: req.user._id },
    });
    if (existing) return res.status(400).json({ message: "Username taken" });
  }

  const updated = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
  }).select("-password");
  res.json(updated);
};

// Follow / Unfollow
exports.follow = async (req, res) => {
  const targetId = req.params.id;
  if (req.user._id.equals(targetId))
    return res.status(400).json({ message: "Cannot follow yourself" });

  await User.findByIdAndUpdate(targetId, {
    $addToSet: { followers: req.user._id },
  });
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { following: targetId },
  });
  res.json({ message: "Followed" });
};

exports.unfollow = async (req, res) => {
  const targetId = req.params.id;
  await User.findByIdAndUpdate(targetId, {
    $pull: { followers: req.user._id },
  });
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: targetId },
  });
  res.json({ message: "Unfollowed" });
};

// Search users
exports.search = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ users: [] });

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const results = await User.find({
    $and: [
      { _id: { $ne: req.user._id } },
      { $or: [{ username: regex }, { email: regex }] },
    ],
  })
    .select("username avatarUrl bio followers following")
    .limit(20);

  const followingSet = new Set((req.user.following || []).map(String));
  const users = results.map((u) => ({
    _id: u._id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    bio: u.bio,
    isFollowing: followingSet.has(String(u._id)),
  }));
  res.json({ users });
};
