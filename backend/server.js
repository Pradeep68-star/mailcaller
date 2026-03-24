// ⭐ LOAD ENV FIRST
import "./config/env.js";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { startScanJob } from "./jobs/scanJob.js";

import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import engineRoutes from "./routes/engineRoutes.js";
import callRoutes from "./routes/callRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import googleRoutes from "./routes/googleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import "./config/passportGoogle.js"; // ⭐ MUST BE IMPORTED

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();   // ✅ DEFINE APP FIRST
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
// ROUTES
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/user", userRoutes);   // ✅ MOVED HERE
app.use("/api/engine", engineRoutes);

app.use("/api/call", callRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// --------------------
// DB + SERVER START
// --------------------
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    startScanJob();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  

};

start();
