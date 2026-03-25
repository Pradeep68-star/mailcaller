import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emailId: String,

    subject: String,

    eventTime: Date,
    reminderTimes: [Date],

    calledTimes: [Date],

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