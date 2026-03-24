import cron from "node-cron";
import User from "../models/User.js";
import engineScan from "../services/engineScanService.js";

export const startScanJob = () => {
  // Run every 1 minute
  cron.schedule("* * * * *", async () => {
    console.log("🔄 Running scan job...");

    const users = await User.find({});

    for (let user of users) {
      try {
        await engineScan(user._id);
      } catch (err) {
        console.error("Scan failed for user:", user.email);
      }
    }
  });
};
