const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

exports.sendWhatsApp = async (to, message) => {
  try {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+91" + to,
      body: message
    });
    console.log(`WhatsApp sent successfully to +91${to}. SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error(`WhatsApp FAILED to +91${to}:`, error.message);
    throw error;
  }
};
