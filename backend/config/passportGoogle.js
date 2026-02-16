import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

console.log("🔥 passportGoogle.js loaded");
console.log(
  "GOOGLE_CLIENT_ID:",
  process.env.GOOGLE_CLIENT_ID ? "✓" : "✗"
);
console.log(
  "GOOGLE_CLIENT_SECRET:",
  process.env.GOOGLE_CLIENT_SECRET ? "✓" : "✗"
);

// --------------------------------------------------
// Serialize / Deserialize (SESSION SUPPORT)
// --------------------------------------------------
passport.serializeUser((user, done) => {
  done(null, user.id || user);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (typeof id === "string") {
      const user = await User.findById(id);
      return done(null, user);
    }
    done(null, id);
  } catch (err) {
    done(err, null);
  }
});

// ==================================================
// 1️⃣ GOOGLE LOGIN STRATEGY (LOGIN / SIGNUP)
// ==================================================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              isVerified: true,
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = true;
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // ==================================================
  // 2️⃣ GOOGLE GMAIL CONNECT STRATEGY (GMAIL ONLY)
  // ==================================================
  passport.use(
    "google-gmail",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_GMAIL_CALLBACK_URL ||
          "http://localhost:5000/api/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("🔥 Google GMAIL CONNECT callback");

          const authorizedGmail =
            profile.emails?.[0]?.value?.toLowerCase();

          const expectedGmail =
            req.session?.expectedGmail?.toLowerCase();

          if (!expectedGmail || authorizedGmail !== expectedGmail) {
            console.log("❌ Gmail mismatch");
            return done(null, false);
          }

          return done(null, {
            gmail: authorizedGmail,
            accessToken,
            refreshToken,
          });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️  Google OAuth credentials not configured");
}