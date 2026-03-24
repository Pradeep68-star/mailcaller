import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔹 Basic Identity
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: String,
    password: String, // for local auth if needed

    // 🔹 Phone Settings
    phoneNumber: {
      type: String,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // 🔹 Event Detection Settings
    scanInterval: {
      type: Number,
      default: 5, // minutes
    },

    keywords: {
      type: [String],
      default: [
        "meeting",
        "schedule",
        "event",
        "hackathon",
        "contest",
        "interview",
        "reminder",
        "call",
        "appointment",
        "conference",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
