const Post = require("../models/Post");
const User = require("../models/User");

// Create post
exports.create = async (req, res) => {
  const { content } = req.body;
  if (!content || content.length > 280)
    return res.status(400).json({ message: "Invalid content" });

  const post = await Post.create({ content, author: req.user._id });
  await post.populate("author", "username avatarUrl");
  res.status(201).json(post);
};

// Edit post
exports.edit = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.user._id))
    return res.status(403).json({ message: "Not owner" });

  post.content = req.body.content ?? post.content;
  await post.save();
  res.json(post);
};

// Delete post
exports.delete = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.user._id))
    return res.status(403).json({ message: "Not owner" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};

// Get feed (posts from followed users + own)
exports.getFeed = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  const me = await User.findById(req.user._id).select("following");
  const authors = [...(me.following || []), req.user._id];

  const posts = await Post.find({ author: { $in: authors } })
    .populate("author", "username avatarUrl")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ posts, page });
};

// Like / Unlike posts
exports.like = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).populate("author", "username avatarUrl");

  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ post, likes: post.likes.length });
};

exports.unlike = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  ).populate("author", "username avatarUrl");

  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ post, likes: post.likes.length });
};
