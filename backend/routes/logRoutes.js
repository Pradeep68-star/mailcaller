import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Reminder from "../models/Reminder.js";

const router = express.Router();

// 📊 GET USER LOGS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    const logs = reminders.map((r) => ({
      subject: r.subject,
      eventTime: r.eventTime,
      callTime: r.reminderTimes?.[1] || r.eventTime, // 1 hour before
      status: r.status,
    }));

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

export default router;