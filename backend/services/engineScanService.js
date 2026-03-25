import { google } from "googleapis";
import * as chrono from "chrono-node";

import GmailAccount from "../models/GmailAccount.js";
import User from "../models/User.js";
import Reminder from "../models/Reminder.js";

const engineScan = async (userId) => {
  const gmailAccount = await GmailAccount.findOne({
    userId,
    isActive: true,
  });

  if (!gmailAccount) return;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: gmailAccount.accessToken,
    refresh_token: gmailAccount.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const user = await User.findById(userId);

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
    q: "newer_than:1d", // 🔥 optimization
  });

  const messages = response.data.messages || [];

  for (let msg of messages) {
    // ✅ duplicate protection FIRST
    const existing = await Reminder.findOne({
      userId,
      emailId: msg.id,
    });

    if (existing) continue;

    const email = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    const text =
      email.data.snippet?.toLowerCase() || "";

    const matched = user.keywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );

    if (!matched) continue;

    const parsedDate = chrono.parseDate(text);
    if (!parsedDate) continue;

    const reminderTimes = [
      new Date(parsedDate.getTime() - 3 * 60 * 60 * 1000),
      new Date(parsedDate.getTime() - 1 * 60 * 60 * 1000),
      parsedDate,
    ];

    await Reminder.create({
      userId,
      emailId: msg.id,
      subject: email.data.snippet || "Event detected",
      eventTime: parsedDate,
      reminderTimes,
    });

    console.log("✅ Reminder created safely");
  }
};

export default engineScan;