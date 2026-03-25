import cron from "node-cron";
import { runCallJob } from "./callJob.js";

export const startCallJob = () => {
  console.log("📞 Call scheduler started");

  cron.schedule(`* * * * *`, async () => {
    await runCallJob();
  });
};