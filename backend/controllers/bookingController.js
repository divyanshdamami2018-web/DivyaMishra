const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const sendEmail = require("../services/emailService");
const { sendWhatsAppAlert } = require("../services/whatsappService");
const { createMeetSession } = require("../services/calendarService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// ── Create Order ──────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;

    // 1. Validate date is not in the past
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return res.status(400).json({ error: "Please select a future date for your session." });
      }
    }

    // 2. Check for slot conflict — same date + same time already booked
    if (date && timeSlot) {
      const existing = await Booking.findOne({
        date,
        time: timeSlot,
        paymentStatus: "paid"
      });
      if (existing) {
        return res.status(409).json({
          error: `The slot "${timeSlot}" on ${date} is already booked. Please choose a different time.`
        });
      }
    }

    // 3. Create Razorpay order — locked at ₹1,500
    const amountInPaise = 150000;
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR"
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay Create Order Error:", err);
    res.status(500).json({ error: "Failed to initialize payment" });
  }
};

// ── Verify Payment ────────────────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }

    const ticketId = "MH-" + Date.now();
    
    // Attempt to generate Google Meet Link (fails silently if credentials missing)
    const googleMeetLink = await createMeetSession(
      { date: formData.date, time: formData.timeSlot, ticketId }, 
      formData.email
    );

    const booking = new Booking({
      userId: formData.userId || null,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.timeSlot,
      assessment: formData.assessment || {},
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      amount: 150000, // 1500 INR in paise
      ticketId,
      googleMeetLink
    });

    await booking.save();

    // ── Build notification messages ──────────────────────────────────────────
    const meetText = googleMeetLink ? `🎥 *Google Meet Link:* ${googleMeetLink}\n` : ``;
    const userMessage =
      `🌿 *Session Confirmed — Mental Health with Divya Mishra* 🌿\n\n` +
      `Hello *${formData.name}*, your counseling session is confirmed!\n\n` +
      `🎟️ *Ticket ID:* ${ticketId}\n` +
      `📅 *Date:* ${formData.date}\n` +
      `⏰ *Time Slot:* ${formData.timeSlot}\n` +
      meetText + `\n` +
      `*What's Next:*\n` +
      `If a Meet link wasn't provided above, it will be shared 15 minutes before your session starts.\n\n` +
      `Please save this ticket ID for your records. We look forward to seeing you! 💚`;

    const adminMessage =
      `🔔 *New Booking Alert!*\n\n` +
      `*Client:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Date:* ${formData.date}\n` +
      `*Time:* ${formData.timeSlot}\n` +
      `*Ticket ID:* ${ticketId}\n\n` +
      `*Assessment Details:*\n` +
      `Age: ${formData.assessment?.age || "N/A"}\n` +
      `Gender: ${formData.assessment?.gender || "N/A"}\n` +
      `Occupation: ${formData.assessment?.occupation || "N/A"}\n` +
      `Education: ${formData.assessment?.education || "N/A"}\n` +
      `Income: ${formData.assessment?.income || "N/A"}\n` +
      `Concern: ${formData.assessment?.primaryConcern || "N/A"}\n` +
      `Mood Index: ${formData.assessment?.moodRating || "N/A"}/10\n` +
      `Note: ${formData.assessment?.description || "N/A"}`;

    // ── User Notifications ───────────────────────────────────────────────────
    try {
      await Promise.all([
        sendEmail(formData.email, "Session Confirmed ✅ — Mental Health with Divya Mishra", userMessage),
        sendWhatsAppAlert(formData.phone, userMessage)
      ]);
      console.log(`✅ User notifications sent to ${formData.email} / ${formData.phone}`);
    } catch (err) {
      console.error("User Notification Error:", err.message);
    }

    // ── Admin Notifications ──────────────────────────────────────────────────
    try {
      await Promise.all([
        sendEmail(process.env.ADMIN_EMAIL, "🔔 NEW BOOKING — Mental Health with Divya Mishra", adminMessage),
        sendWhatsAppAlert(process.env.ADMIN_PHONE, adminMessage)
      ]);
    } catch (err) {
      console.error("Admin Notification Error:", err.message);
    }

    res.json({ success: true, ticketId, googleMeetLink });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: "Server error during payment verification" });
  }
};

// ── Get My Bookings (Protected) ───────────────────────────────────────────────
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Fetch My Bookings Error:", err);
    res.status(500).json({ error: "Failed to fetch your bookings" });
  }
};

// ── Submit Feedback ───────────────────────────────────────────────────────────
exports.submitFeedback = async (req, res) => {
  try {
    const { ticketId, rating, message } = req.body;

    const booking = await Booking.findOne({ ticketId });
    if (!booking) return res.status(404).json({ error: "Ticket not found" });
    if (booking.feedbackSubmitted)
      return res.status(400).json({ error: "Feedback already submitted for this session" });

    booking.feedback = { rating, message };
    booking.feedbackSubmitted = true;
    booking.sessionCompleted = true;
    await booking.save();

    const feedbackAlert =
      `⭐ *New Feedback Received!*\n\n` +
      `Rating: ${rating}/5 ${"⭐".repeat(rating)}\n` +
      `Client: ${booking.name}\n` +
      `Ticket: ${ticketId}\n` +
      `Message: ${message || "No written comment."}`;

    try {
      await Promise.all([
        sendEmail(process.env.ADMIN_EMAIL, `⭐ New Feedback (${rating}/5) — ${booking.name}`, feedbackAlert),
        sendWhatsApp(process.env.ADMIN_PHONE, feedbackAlert)
      ]);
    } catch (err) {
      console.error("Admin Feedback Notification Error:", err.message);
    }

    res.json({ message: "Feedback submitted successfully 💚" });
  } catch (err) {
    console.error("Feedback Error:", err);
    res.status(500).json({ error: "Server error handling feedback" });
  }
};

// ── Handle Contact Form ───────────────────────────────────────────────────────
exports.handleContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const adminAlert =
      `✉️ *New Contact Inquiry!*\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Message: ${message}`;

    const userConfirmation =
      `Hello ${name},\n\n` +
      `Thank you for reaching out to Mental Health with Divya Mishra! 🌿\n\n` +
      `We have received your message and will get back to you within 24 business hours.\n\n` +
      `Your message:\n"${message}"\n\n` +
      `In the meantime, you can also WhatsApp us directly at +91 99298 14206.\n\n` +
      `Warm regards,\nDivya Mishra\nCounseling Psychologist`;

    try {
      await Promise.all([
        // Notify admin
        sendEmail(process.env.ADMIN_EMAIL, `✉️ New Contact Inquiry — ${name}`, adminAlert),
        sendWhatsAppAlert(process.env.ADMIN_PHONE, adminAlert),
        // Confirm to user
        sendEmail(email, "We received your message 🌿 — Mental Health with Divya Mishra", userConfirmation)
      ]);
      res.json({ success: true, message: "Your message has been sent successfully!" });
    } catch (err) {
      console.error("Contact Notification Error:", err.message);
      res.status(500).json({ error: "Failed to send message. Please try again." });
    }
  } catch (err) {
    console.error("Contact Form Error:", err);
    res.status(500).json({ error: "Server error processing contact form" });
  }
};

// ── Request Cancellation (Client Action) ──────────────────────────────────────
exports.requestCancelSession = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ error: "Session not found" });

    booking.cancelRequested = true;
    booking.cancelReason = reason || "No reason provided";
    await booking.save();

    const adminMessage =
      `🚨 *Session Cancellation Request!*\n\n` +
      `*Client:* ${booking.name}\n` +
      `*Ticket ID:* ${booking.ticketId}\n` +
      `*Schedule:* ${booking.date} @ ${booking.time}\n` +
      `*Reason:* ${reason || "No reason provided"}\n\n` +
      `Please approve or reject this request in the Admin Suite dashboard.`;

    try {
      await Promise.all([
        sendEmail(process.env.ADMIN_EMAIL, `🚨 Cancellation Request — ${booking.name}`, adminMessage),
        sendWhatsAppAlert(process.env.ADMIN_PHONE, adminMessage)
      ]);
    } catch (err) {
      console.error("Admin cancellation request alert error:", err.message);
    }

    res.json({ message: "Cancellation request submitted successfully 💚" });
  } catch (err) {
    console.error("Request Cancel Error:", err);
    res.status(500).json({ error: "Failed to request cancellation" });
  }
};

// ── Request Reschedule (Client Action) ────────────────────────────────────────
exports.requestRescheduleSession = async (req, res) => {
  try {
    const { proposedDate, proposedTime, reason } = req.body;
    if (!proposedDate || !proposedTime) {
      return res.status(400).json({ error: "Proposed date and time are required" });
    }

    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ error: "Session not found" });

    booking.rescheduleRequested = true;
    booking.proposedDate = proposedDate;
    booking.proposedTime = proposedTime;
    booking.requestReason = reason || "No reason provided";
    await booking.save();

    const adminMessage =
      `📅 *Session Reschedule Request!*\n\n` +
      `*Client:* ${booking.name}\n` +
      `*Ticket ID:* ${booking.ticketId}\n` +
      `*Current Schedule:* ${booking.date} @ ${booking.time}\n` +
      `*Proposed Schedule:* ${proposedDate} @ ${proposedTime}\n` +
      `*Reason:* ${reason || "No reason provided"}\n\n` +
      `Please approve or reject this request in the Admin Suite dashboard.`;

    try {
      await Promise.all([
        sendEmail(process.env.ADMIN_EMAIL, `📅 Reschedule Request — ${booking.name}`, adminMessage),
        sendWhatsAppAlert(process.env.ADMIN_PHONE, adminMessage)
      ]);
    } catch (err) {
      console.error("Admin reschedule request alert error:", err.message);
    }

    res.json({ message: "Reschedule request submitted successfully 💚" });
  } catch (err) {
    console.error("Request Reschedule Error:", err);
    res.status(500).json({ error: "Failed to request rescheduling" });
  }
};
