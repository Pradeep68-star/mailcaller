import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const makeCall = async (to, message) => {
  try {
    const call = await client.calls.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: `<Response><Say>${message}</Say></Response>`,
    });

    console.log("📞 Call triggered:", call.sid);
  } catch (err) {
    console.error("❌ Call error:", err.message);
    reminder.status = "failed";

  }
  
};