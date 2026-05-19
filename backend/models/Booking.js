const mongoose = require("mongoose");

const { encrypt, decrypt } = require("../utils/cryptoEngine");

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

  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: "pending" },
  paymentId: String,
  amount: Number,
  ticketId: { type: String, unique: true },
  googleMeetLink: String,

  followUpSent: { type: Boolean, default: false },
  sessionCompleted: { type: Boolean, default: false },
  feedbackSubmitted: { type: Boolean, default: false },

  feedback: {
    rating: Number,
    message: String
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "rescheduled"],
    default: "confirmed"
  },
  rescheduleNotes: String,

  // Patient Request Actions
  cancelRequested: { type: Boolean, default: false },
  cancelReason: String,
  rescheduleRequested: { type: Boolean, default: false },
  proposedDate: String,
  proposedTime: String,
  requestReason: String,

  assessment: {
    age: Number,
    gender: String,
    cityState: String,
    education: String,
    occupation: String,
    income: String,
    primaryConcern: { type: String, set: encrypt, get: decrypt },
    moodRating: Number,
    description: { type: String, set: encrypt, get: decrypt }
  },

  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Prevent double bookings
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
