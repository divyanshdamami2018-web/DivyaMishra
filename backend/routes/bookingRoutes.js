const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  submitFeedback,
  getMyBookings,
  handleContactForm
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/submit-feedback", submitFeedback);
router.post("/contact", handleContactForm);
router.get("/my-bookings", authMiddleware, getMyBookings);

module.exports = router;
