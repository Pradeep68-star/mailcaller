import express from "express";
import passport from "passport";
import GmailAccount from "../models/GmailAccount.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🚀 START GMAIL OAUTH
 * ❌ NO authMiddleware
 */
router.get("/connect", (req, res, next) => {
  const { expectedGmail } = req.query;

  if (!expectedGmail) {
    return res.redirect(
      "http://localhost:5173/settings?error=missing_gmail"
    );
  }

  req.session.expectedGmail = expectedGmail.toLowerCase();

  passport.authenticate("google-gmail", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  })(req, res, next);
});

/**
 * 🔁 OAUTH CALLBACK
 * ❌ NO authMiddleware
 */
router.get(
  "/callback",
  passport.authenticate("google-gmail", {
    failureRedirect:
      "http://localhost:5173/settings?error=gmail_mismatch",
    session: false,
  }),
  async (req, res) => {
    const { gmail, accessToken, refreshToken } = req.user;

    // ⚠️ Prototype version (single-user assumption)
    await GmailAccount.findOneAndUpdate(
      { gmailAddress: gmail },
      {
        gmailAddress: gmail,
        accessToken,
        refreshToken,
        isActive: true,
      },
      { upsert: true }
    );

    req.session.expectedGmail = null;

    res.redirect(
      "http://localhost:5173/settings?gmail=connected"
    );
  }
);

/**
 * 🔐 PROTECTED ROUTES (JWT)
 */
router.get("/status", authMiddleware, async (req, res) => {
  const acc = await GmailAccount.findOne({
    userId: req.user.id,
    isActive: true,
  });

  if (!acc) return res.json({ connected: false });

  res.json({
    connected: true,
    gmail: acc.gmailAddress,
  });
});

router.post("/disconnect", authMiddleware, async (req, res) => {
  await GmailAccount.updateMany(
    { userId: req.user.id },
    { isActive: false }
  );

  res.json({ message: "Gmail disconnected" });
});

export default router;