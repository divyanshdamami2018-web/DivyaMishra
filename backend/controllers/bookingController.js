const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const sendEmail = require("../services/emailService");
const { sendWhatsApp } = require("../services/whatsappService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const amountInPaise = 150000; // Locked at 1,500 INR for Production

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

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      const ticketId = "MH-" + Date.now();

      const booking = new Booking({
        userId: formData.userId || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.timeSlot,
        assessment: formData.assessment || {},
        paymentStatus: "paid",
        ticketId
      });

      await booking.save();
      
      // 1. Create formatted messages
      const userMessage = `🌿 *Counseling Psychologist Booking Confirmed* 🌿\n\nHello *${formData.name}*, your session is secured!\n\n🎟️ *Ticket ID:* ${ticketId}\n📅 *Date:* ${formData.date}\n⏰ *Time Slot:* ${formData.timeSlot}\n\n*Next Steps:*\nA session link will be shared with you 15 minutes before the start time. \n\nPlease keep this ticket for your reference.`;
      
      const adminMessage = `New Booking Alert! 🔔\n\nClient: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.timeSlot}\nTicket ID: ${ticketId}\n\n*Assessment Details:*\nAge: ${formData.assessment?.age || "N/A"}\nGender: ${formData.assessment?.gender || "N/A"}\nOccupation: ${formData.assessment?.occupation || "N/A"}\nEducation: ${formData.assessment?.education || "N/A"}\nIncome: ${formData.assessment?.income || "N/A"}\nConcern: ${formData.assessment?.primaryConcern || "N/A"}\nMood Index: ${formData.assessment?.moodRating || "N/A"}/10\nNote: ${formData.assessment?.description || "N/A"}`;

      // 2. Dispatch User Notifications (PRIORITY)
      try {
        await Promise.all([
          sendEmail(formData.email, "Session Confirmed - Counseling Psychologist", userMessage),
          sendWhatsApp(formData.phone, userMessage)
        ]);
        console.log(`User notifications sent successfully to ${formData.email} and ${formData.phone}`);
      } catch (err) {
        console.error("User Notification Error:", err.message);
      }

      // 3. Dispatch Admin Notifications (SECONDARY)
      try {
        await Promise.all([
          sendEmail(process.env.ADMIN_EMAIL, "NEW BOOKING ALERT", adminMessage),
          sendWhatsApp(process.env.ADMIN_PHONE, adminMessage)
        ]);
      } catch (err) {
        console.error("Admin Notification Error:", err.message);
      }

      res.json({ success: true, ticketId });
    } else {
      res.status(400).json({ success: false, error: "Invalid payment signature" });
    }
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: "Server error during payment verification" });
  }
};

// Get My Bookings (Protected)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Fetch My Bookings Error:", err);
    res.status(500).json({ error: "Failed to fetch your bookings" });
  }
};

// Feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { ticketId, rating, message } = req.body;

    const booking = await Booking.findOne({ ticketId });

    if (!booking) return res.status(404).json({ error: "Ticket Not found" });

    if (booking.feedbackSubmitted)
      return res.status(400).json({ error: "Feedback Already submitted" });

    booking.feedback = { rating, message };
    booking.feedbackSubmitted = true;
    booking.sessionCompleted = true;

    await booking.save();

    // Notify Admin of new Feedback
    const feedbackAlert = `New Feedback Received! ⭐\n\nRating: ${rating}/5\nClient: ${booking.name}\nTicket: ${ticketId}\nMessage: ${message}`;
    
    try {
      await Promise.all([
        sendEmail(process.env.ADMIN_EMAIL, "NEW FEEDBACK RECEIVED 🌿", feedbackAlert),
        sendWhatsApp(process.env.ADMIN_PHONE, feedbackAlert)
      ]);
    } catch (err) {
      console.error("Admin Feedback Notification Error:", err.message);
    }

    res.json({ message: "Feedback submitted 💚" });
  } catch (err) {
    console.error("Feedback Error:", err);
    res.status(500).json({ error: "Server error handling feedback" });
  }
};

// Handle Contact Form
exports.handleContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contactAlert = `New Contact Inquiry! ✉️\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

    // Notify Admin
    try {
      await Promise.all([
        sendEmail(process.env.ADMIN_EMAIL, "NEW CONTACT INQUIRY ✉️", contactAlert),
        sendWhatsApp(process.env.ADMIN_PHONE, contactAlert)
      ]);
      res.json({ success: true, message: "Inquiry sent to Admin" });
    } catch (err) {
      console.error("Admin Contact Notification Error:", err.message);
      res.status(500).json({ error: "Failed to notify Admin, but inquiry captured" });
    }
  } catch (err) {
    console.error("Contact Form Error:", err);
    res.status(500).json({ error: "Server error processing contact form" });
  }
};
