require("dotenv").config();
const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

client.api.accounts(process.env.TWILIO_SID)
  .fetch()
  .then(account => {
    console.log("SUCCESS: Twilio Connected ✅");
    console.log("Account Status:", account.status);
    console.log("Account Name:", account.friendlyName);
    process.exit(0);
  })
  .catch(err => {
    console.log("FAILED: ❌", err.message);
    process.exit(1);
  });
