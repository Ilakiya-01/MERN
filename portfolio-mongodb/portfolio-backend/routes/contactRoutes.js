import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
export default router;
=======
export default router; // ✅ default export
>>>>>>> 2095dc6aefdade4f746c055b30f493856505867f
