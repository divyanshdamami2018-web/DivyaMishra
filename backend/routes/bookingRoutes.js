const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  submitFeedback,
  getMyBookings,
  handleContactForm,
  requestCancelSession,
  requestRescheduleSession
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/submit-feedback", submitFeedback);
router.post("/contact", handleContactForm);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.post("/bookings/:id/request-cancel", authMiddleware, requestCancelSession);
router.post("/bookings/:id/request-reschedule", authMiddleware, requestRescheduleSession);

module.exports = router;
