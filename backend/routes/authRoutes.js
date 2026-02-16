import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

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
 * GET /api/auth/me
 */
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({ user: req.user });
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
 * Google OAuth callback
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

      // 🔥 IMPORTANT: Redirect to root with token
      res.redirect(`http://localhost:5173/?token=${token}`);
    } catch (error) {
      console.error("JWT Error:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);

export default router;
