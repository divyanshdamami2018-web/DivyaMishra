const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,

  paymentStatus: { type: String, default: "pending" },
  ticketId: String,

  followUpSent: { type: Boolean, default: false },
  sessionCompleted: { type: Boolean, default: false },
  feedbackSubmitted: { type: Boolean, default: false },

  feedback: {
    rating: Number,
    message: String
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
