import Reminder from "../models/Reminder.js";
import User from "../models/User.js";
import { makeCall } from "../services/callService.js";

export const runCallJob = async () => {
  const now = new Date();

  const reminders = await Reminder.find({
    status: "scheduled",
  });

  for (let reminder of reminders) {
    const user = await User.findById(reminder.userId);

    if (!user?.phoneNumber) continue;

    for (let time of reminder.reminderTimes) {
      const alreadyCalled =
        reminder.calledTimes?.some(
          (t) =>
            new Date(t).getTime() === new Date(time).getTime()
        );

      if (alreadyCalled) continue;

      const diff = Math.abs(new Date(time) - now);

      // 🔥 Increased window (important)
      if (diff < 60000) {
        const message = `Hello. This is MailCaller. 
You have an upcoming event. ${reminder.subject}.
Scheduled at ${new Date(reminder.eventTime).toLocaleString()}`;

        await makeCall(user.phoneNumber, message);

        // ✅ Track call
        reminder.calledTimes = [
          ...(reminder.calledTimes || []),
          time,
        ];

        console.log("📞 Call done");
      }
    }

    // ✅ Mark completed if all calls done
    if (
      reminder.calledTimes?.length ===
      reminder.reminderTimes.length
    ) {
      reminder.status = "completed";
    }

    await reminder.save();
  }
};