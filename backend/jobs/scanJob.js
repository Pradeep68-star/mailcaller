import cron from "node-cron";
import User from "../models/User.js";
import engineScan from "../services/engineScanService.js";

export const startScanJob = () => {
  console.log("🔍 Scan job started");

  cron.schedule("* * * * *", async () => {
    console.log("🔄 Running scan job...");

    const users = await User.find({});

    for (let user of users) {
      try {
        const now = new Date();

        const lastScan = user.lastScanTime
          ? new Date(user.lastScanTime)
          : null;

        const intervalMs = user.scanInterval * 60 * 1000;

        // ⛔ Skip if interval not completed
        if (lastScan && now - lastScan < intervalMs) {
          continue;
        }

        console.log(`✅ Scanning for user: ${user.email}`);

        await engineScan(user._id);

        // 🔥 Update last scan time
        user.lastScanTime = now;
        await user.save();

      } catch (err) {
        console.error("❌ Scan failed:", user.email);
      }
    }
  });
};