require("dotenv").config();
const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const sid = "SM08a644ba4853b2b807f522affedd9d63";

client.messages(sid)
  .fetch()
  .then(message => {
    console.log("Message Details for", sid);
    console.log("To:", message.to);
    console.log("Status:", message.status);
    console.log("Error Code:", message.errorCode);
    console.log("Error Message:", message.errorMessage);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error fetching message:", err.message);
    process.exit(1);
  });
