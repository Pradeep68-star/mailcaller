import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emailId: String,

    // 🔥 IMPROVED
    subject: String,       // email subject
    body: String,          // full parsed content

    eventTime: Date,
    reminderTimes: [Date],

    // 🔥 NEW (VERY USEFUL)
    source: {
      type: String,
      default: "gmail",
    },

    status: {
      type: String,
      enum: ["scheduled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);