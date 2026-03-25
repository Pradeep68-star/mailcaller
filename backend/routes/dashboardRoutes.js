import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Reminder from "../models/Reminder.js";
import engineScan from "../services/engineScanService.js";

const router = express.Router();

// 📊 STATS
router.get("/stats", authMiddleware, async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id });

  res.json({
    totalEvents: reminders.length,
    completed: reminders.filter(r => r.status === "completed").length,
    pending: reminders.filter(r => r.status === "scheduled").length,
  });
});

// 🔥 MANUAL SCAN
router.post("/scan", authMiddleware, async (req, res) => {
  await engineScan(req.user._id);
  res.json({ message: "Scan done" });
});

// 🔁 RETRY FAILED
router.post("/retry", authMiddleware, async (req, res) => {
  await Reminder.updateMany(
    { userId: req.user._id, status: "failed" },
    { status: "scheduled" }
  );

  res.json({ message: "Retry done" });
});

export default router;