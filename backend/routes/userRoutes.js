import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Update Phone
router.put("/phone", authMiddleware, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phoneNumber },
      { new: true }
    );

    res.json({ message: "Phone updated", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update phone" });
  }
});

// 🔹 Update Scan Interval
router.put("/interval", authMiddleware, async (req, res) => {
  try {
    const { scanInterval } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { scanInterval },
      { new: true }
    );

    res.json({ message: "Interval updated", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update interval" });
  }
});

// 🔹 Add Keyword
router.put("/keywords", authMiddleware, async (req, res) => {
  try {
    const { keyword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.keywords.includes(keyword)) {
      user.keywords.push(keyword);
      await user.save();
    }

    res.json({ message: "Keyword added", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update keywords" });
  }
});
router.put("/keywords/remove", authMiddleware, async (req, res) => {
  const { keyword } = req.body;
  const user = await User.findById(req.user.id);
  user.keywords = user.keywords.filter((k) => k !== keyword);
  await user.save();
  res.json({ user });
});



export default router;
