require("dotenv").config();
const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

client.messages.list({ limit: 20 })
  .then(messages => {
    console.log("Recent Message History:");
    messages.forEach(m => {
      console.log(`From: ${m.from} | To: ${m.to} | Body: ${m.body} | Status: ${m.status}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
