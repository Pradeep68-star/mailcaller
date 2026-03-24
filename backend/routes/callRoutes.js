import express from "express";
import twilio from "twilio";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// 🔥 Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * POST /api/call/test
 * Trigger dynamic voice call
 */
router.post("/test", authMiddleware, async (req, res) => {
  try {
    // 🔍 Get user from DB
    const user = await User.findById(req.user._id);

    if (!user || !user.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number not set for user",
      });
    }

    // 👤 Dynamic user name
    const userName = user.name || "User";

    // 📧 Temporary test subject (later we fetch from Gmail)
    const subject = "Hackathon tomorrow at 10 AM";

    // 📞 Create Twilio call with dynamic voice message
    const call = await client.calls.create({
      to: user.phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: `
        <Response>
          <Say voice="alice">
            Hello ${userName}.
            You have a new email.
            The subject is ${subject}.
          </Say>
        </Response>
      `
    });

    return res.json({
      success: true,
      message: "📞 Dynamic call initiated successfully",
      sid: call.sid,
    });

  } catch (error) {
    console.error("❌ Call Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Call failed",
      error: error.message,
    });
  }
});

export default router;