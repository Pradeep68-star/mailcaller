import express from "express";
import { google } from "googleapis";
import * as chrono from "chrono-node";

import authMiddleware from "../middleware/authMiddleware.js";
import GmailAccount from "../models/GmailAccount.js";
import User from "../models/User.js";
import Reminder from "../models/Reminder.js";

const router = express.Router();

/*
  POST /api/engine/scan
  Manually scan Gmail and create reminders
*/
router.post("/scan", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔹 Get connected Gmail
    const gmailAccount = await GmailAccount.findOne({
      userId,
      isActive: true,
    });

    if (!gmailAccount) {
      return res.status(400).json({ message: "No Gmail connected" });
    }

    // 🔹 Setup OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: gmailAccount.accessToken,
      refresh_token: gmailAccount.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 🔹 Get user settings
    const user = await User.findById(userId);

    // 🔹 Fetch recent emails
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages || [];

    let createdReminders = [];
    let scannedCount = messages.length;

    for (let msg of messages) {
      // Get full email
      const email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const snippet = email.data.snippet?.toLowerCase() || "";

      // 🔹 Keyword Match
      const matched = user.keywords.some((keyword) =>
        snippet.includes(keyword.toLowerCase())
      );

      if (!matched) continue;

      // 🔹 Extract Date
      const parsedDate = chrono.parseDate(snippet);

      if (!parsedDate) continue;

      // 🔹 Prevent duplicate reminder
      const existing = await Reminder.findOne({
        userId,
        emailId: msg.id,
      });

      if (existing) continue;

      // 🔹 Create reminder times (3h before, 1h before, exact time)
      const reminderTimes = [
        new Date(parsedDate.getTime() - 3 * 60 * 60 * 1000),
        new Date(parsedDate.getTime() - 1 * 60 * 60 * 1000),
        parsedDate,
      ];

      const reminder = await Reminder.create({
        userId,
        emailId: msg.id,
        subject: email.data.snippet,
        eventTime: parsedDate,
        reminderTimes,
      });

      createdReminders.push({
        emailId: msg.id,
        eventTime: parsedDate,
      });
    }

    res.json({
      success: true,
      scanned: scannedCount,
      created: createdReminders.length,
      reminders: createdReminders,
    });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({
      success: false,
      message: "Scan failed",
    });
  }
});

export default router;
