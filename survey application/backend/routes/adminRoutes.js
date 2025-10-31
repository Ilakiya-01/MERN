import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Question from "../models/Question.js";
import Response from "../models/Response.js";

const router = express.Router();

router.post("/add", protect, adminOnly, async (req, res) => {
  const q = await Question.create(req.body);
  res.json(q);
});

router.get("/questions", protect, adminOnly, async (req, res) => {
  res.json(await Question.find());
});

router.delete("/delete/:id", protect, adminOnly, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

router.get("/responses", protect, adminOnly, async (req, res) => {
  res.json(await Response.find().populate("user"));
});

export default router;
