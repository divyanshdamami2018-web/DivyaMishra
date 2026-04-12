const express = require("express");
const router = express.Router();
const sendEmail = require("../services/emailService");

router.get("/send-mail", async (req, res) => {
  await sendEmail(
    "receiver@gmail.com",
    "Test Email",
    "Hello! Your email system is working 🚀"
  );

  res.send("Email sent!");
});

module.exports = router;
