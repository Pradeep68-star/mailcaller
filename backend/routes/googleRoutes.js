import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import GmailAccount from "../models/GmailAccount.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🚀 START GMAIL CONNECT
 */
router.get("/connect", async (req, res, next) => {
  try {
    const { token, expectedGmail } = req.query;

    // ❌ No token
    if (!token  || token.length < 20) {
      return res.redirect(
        "http://localhost:5173/settings?error=no_token"
      );
    }

    // ❌ No Gmail entered
    if (!expectedGmail) {
      return res.redirect(
        "http://localhost:5173/settings?error=missing_gmail"
      );
    }

    // ✅ VERIFY JWT TOKEN
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id);

    if (!user) {
      return res.redirect(
        "http://localhost:5173/settings?error=invalid_user"
      );
    }

    // 🔥 STORE USER ID IN SESSION
    req.session.userId = user._id;

    console.log("🔥 Stored userId in session:", user._id);

    // 🚀 START GOOGLE OAUTH
    passport.authenticate("google-gmail", {
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/gmail.readonly",
      ],
      accessType: "offline",
      prompt: "consent",
    })(req, res, next);

  } catch (err) {
    console.error("❌ Token verification failed:", err.message);

    return res.redirect(
      "http://localhost:5173/settings?error=auth_failed"
    );
  }
});

/**
 * 🔁 CALLBACK
 */
router.get(
  "/callback",
  passport.authenticate("google-gmail", {
    failureRedirect:
      "http://localhost:5173/settings?error=gmail_failed",
    session: false,
  }),
  async (req, res) => {
    try {
      const { gmail, accessToken, refreshToken } = req.user;

      // 🔥 GET USER ID FROM SESSION
      const userId = req.session.userId;

      console.log("🔥 Session userId:", userId);

      if (!userId) {
        console.log("❌ userId missing in session");
        return res.redirect(
          "http://localhost:5173/settings?error=no_user"
        );
      }

      // 🔥 SAVE GMAIL ACCOUNT
      await GmailAccount.findOneAndUpdate(
        { userId },
        {
          userId,
          gmailAddress: gmail,
          accessToken,
          refreshToken,
          isActive: true,
        },
        { upsert: true, new: true }
      );

      console.log("✅ Gmail saved for user:", userId);

      // 🔁 Redirect back to frontend
      res.redirect(
        "http://localhost:5173/settings?gmail=connected"
      );

    } catch (err) {
      console.error("❌ Gmail connect error:", err);
      res.redirect(
        "http://localhost:5173/settings?error=server"
      );
    }
  }
);

/**
 * 🔐 STATUS
 */
router.get("/status", authMiddleware, async (req, res) => {
  const acc = await GmailAccount.findOne({
    userId: req.user._id,
    isActive: true,
  });

  if (!acc) return res.json({ connected: false });

  res.json({
    connected: true,
    gmail: acc.gmailAddress,
  });
});

/**
 * 🔐 DISCONNECT
 */
router.post("/disconnect", authMiddleware, async (req, res) => {
  await GmailAccount.updateMany(
    { userId: req.user._id },
    { isActive: false }
  );

  res.json({ message: "Disconnected" });
});

export default router;