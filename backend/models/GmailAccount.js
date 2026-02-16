import mongoose from "mongoose";

const gmailAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gmailAddress: {
    type: String,
    required: true,
  },
  accessToken: String,
  refreshToken: String,
  scope: String,
  tokenExpiry: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GmailAccount", gmailAccountSchema);
