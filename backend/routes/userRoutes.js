import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================
// 📞 UPDATE PHONE
// ============================
router.put("/phone", authMiddleware, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phoneNumber },
      { new: true }
    );

    res.json({ message: "Phone updated", user });

  } catch (error) {
    console.error("Phone update error:", error);
    res.status(500).json({ error: "Failed to update phone" });
  }
});

// ============================
// ⏱ UPDATE SCAN INTERVAL
// ============================
router.put("/interval", authMiddleware, async (req, res) => {
  try {
    const { scanInterval } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { scanInterval },
      { new: true }
    );

    res.json({ message: "Interval updated", user });

  } catch (error) {
    console.error("Interval update error:", error);
    res.status(500).json({ error: "Failed to update interval" });
  }
});

// ============================
// ➕ ADD KEYWORD
// ============================
router.put("/keywords", authMiddleware, async (req, res) => {
  try {
    let { keyword } = req.body;

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ error: "Keyword required" });
    }

    keyword = keyword.toLowerCase().trim();

    const user = await User.findById(req.user._id);

    // Avoid duplicates
    if (!user.keywords.includes(keyword)) {
      user.keywords.push(keyword);
      await user.save();
    }

    res.json({
      message: "Keyword added",
      user,
    });

  } catch (error) {
    console.error("Add keyword error:", error);
    res.status(500).json({ error: "Failed to add keyword" });
  }
});

// ============================
// ❌ REMOVE KEYWORD
// ============================
router.put("/keywords/remove", authMiddleware, async (req, res) => {
  try {
    let { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword required" });
    }

    keyword = keyword.toLowerCase().trim();

    const user = await User.findById(req.user._id);

    user.keywords = user.keywords.filter((k) => k !== keyword);

    await user.save();

    res.json({
      message: "Keyword removed",
      user,
    });

  } catch (error) {
    console.error("Remove keyword error:", error);
    res.status(500).json({ error: "Failed to remove keyword" });
  }
});

export default router;