// ⭐ LOAD ENV FIRST
import "./config/env.js";

import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import cors from "cors";

// 🔥 ROUTES
import logRoutes from "./routes/logRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import googleRoutes from "./routes/googleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import engineRoutes from "./routes/engineRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// 🔥 CONFIG
import "./config/passportGoogle.js";

// 🔥 JOBS
import { startScanJob } from "./jobs/scanJob.js";
import { startCallJob } from "./jobs/callCron.js";

// 🔥 CREATE APP FIRST (VERY IMPORTANT)
const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// MIDDLEWARE
// --------------------
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// SESSION
// --------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mailcaller_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// --------------------
// PASSPORT
// --------------------
app.use(passport.initialize());
app.use(passport.session());

// --------------------
// ROUTES (AFTER app INIT)
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/user", userRoutes);
app.use("/api/engine", engineRoutes);
app.use("/api/call", callRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --------------------
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// --------------------
// START SERVER
// --------------------
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 🔥 Start Jobs ONLY ONCE
    startScanJob();
    startCallJob();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();