import express from "express";
import { protect, userOnly } from "../middleware/authMiddleware.js";
import Question from "../models/Question.js";
import Response from "../models/Response.js";

const router = express.Router();

router.get("/questions", protect, userOnly, async (req, res) => {
  const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
  res.json(questions);
});

router.post("/submit", protect, userOnly, async (req, res) => {
  await Response.create({ user: req.user._id, ...req.body });
  res.json({ msg: "Response submitted successfully!" });
});

export default router;
