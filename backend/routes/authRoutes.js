import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/auth/signup
 */
router.post("/signup", (req, res) => {
  res.json({ message: "Signup endpoint" });
});

/**
 * POST /api/auth/login
 */
router.post("/login", (req, res) => {
  res.json({ message: "Login endpoint" });
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

/**
 * 🔐 GET /api/auth/me
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // 🔥 AUTO DEFAULT KEYWORDS
    if (!user.keywords || user.keywords.length === 0) {
      user.keywords = [
        "meeting",
        "call",
        "interview",
        "hackathon",
        "deadline",
        "contest",
        "exam",
      ];
      await user.save();
    }

    res.json({ user });

  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * GET /api/auth/google
 * Start Google OAuth
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

/**
 * GET /api/auth/google/callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 🔥 REDIRECT WITH TOKEN
      res.redirect(`http://localhost:5173/?token=${token}`);

    } catch (error) {
      console.error("JWT Error:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);

export default router;