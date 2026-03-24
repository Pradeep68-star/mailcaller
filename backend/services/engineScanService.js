import { google } from "googleapis";
import * as chrono from "chrono-node";

import GmailAccount from "../models/GmailAccount.js";
import User from "../models/User.js";
import Reminder from "../models/Reminder.js";

// 🔥 Helper to extract email body
const getEmailBody = (payload) => {
  let body = "";

  const extract = (parts) => {
    for (let part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        body += Buffer.from(part.body.data, "base64").toString("utf-8");
      }

      if (part.parts) {
        extract(part.parts);
      }
    }
  };

  if (payload.parts) {
    extract(payload.parts);
  } else if (payload.body?.data) {
    body = Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  return body.toLowerCase();
};

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

  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      gmailAccount.accessToken = tokens.access_token;
      await gmailAccount.save();
    }
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const user = await User.findById(userId);

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });

  const messages = response.data.messages || [];

  for (let msg of messages) {
    const email = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    // 🔥 GET FULL BODY
    const body = getEmailBody(email.data.payload);

    const text = body || email.data.snippet?.toLowerCase() || "";

    console.log("📩 Email text:", text.slice(0, 100));

    // 🔥 Keyword match
    const matched = user.keywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );

    if (!matched) continue;

    // 🔥 Date parsing
    const parsedDate = chrono.parseDate(text);
    if (!parsedDate) continue;

    // 🔥 Avoid duplicates
    const existing = await Reminder.findOne({
      userId,
      emailId: msg.id,
    });

    if (existing) continue;

    const reminderTimes = [
      new Date(parsedDate.getTime() - 3 * 60 * 60 * 1000),
      new Date(parsedDate.getTime() - 1 * 60 * 60 * 1000),
      parsedDate,
    ];

    await Reminder.create({
      userId,
      emailId: msg.id,
      subject: email.data.snippet || "Event detected",
      body: text, // 🔥 store full content
      eventTime: parsedDate,
      reminderTimes,
    });

    console.log("✅ Reminder created");
  }
};

export default engineScan;