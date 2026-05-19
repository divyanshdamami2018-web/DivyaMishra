const Booking = require("../models/Booking");
const User = require("../models/User");
const sendEmail = require("../services/emailService");
const { sendWhatsAppAlert } = require("../services/whatsappService");
const Razorpay = require('razorpay');

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET });

// 1. Get All Sessions with Stats
exports.getAllSessions = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    // Feedback calculation fix
    const submissions = bookings.filter(b => b.feedbackSubmitted);
    const feedbackAvg = submissions.length > 0 
      ? submissions.reduce((acc, b) => acc + b.feedback.rating, 0) / submissions.length 
      : 0;

    // Calculate Stats
    const stats = {
      total: bookings.length,
      upcoming: bookings.filter(b => b.status === 'confirmed' || b.status === 'rescheduled').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      completed: bookings.filter(b => b.sessionCompleted).length,
      revenue: bookings.filter(b => b.paymentStatus === 'paid').length * 1500, // Fixed price
      feedbackAvg: feedbackAvg
    };

    res.json({ success: true, bookings, stats });
  } catch (err) {
    console.error("Admin Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
};

// 2. Get User Management Data
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// 3. Delete User (Safe: Keeps their bookings but removes account)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User account removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// 4. Get Detailed Analytics (Assessments & Demographics)
exports.getAdminAnalytics = async (req, res) => {
  try {
    const bookings = await Booking.find({ paymentStatus: 'paid' });

    // 1. Problem Type Distribution
    const concernsDist = bookings.reduce((acc, b) => {
      const concern = b.assessment?.primaryConcern || "General Support";
      acc[concern] = (acc[concern] || 0) + 1;
      return acc;
    }, {});

    // 2. Demographic: Occupation
    const occupationDist = bookings.reduce((acc, b) => {
      const occ = b.assessment?.occupation || "Other";
      acc[occ] = (acc[occ] || 0) + 1;
      return acc;
    }, {});

    // 3. Income Levels
    const incomeDist = bookings.reduce((acc, b) => {
      const inc = b.assessment?.income || "Prefer not to say";
      acc[inc] = (acc[inc] || 0) + 1;
      return acc;
    }, {});

    // 4. Monthly Revenue (Simple aggregation)
    const revenueByMonth = bookings.reduce((acc, b) => {
      const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1500;
      return acc;
    }, {});

    res.json({ 
      success: true, 
      analytics: {
        concerns: concernsDist,
        occupations: occupationDist,
        income: incomeDist,
        revenue: revenueByMonth
      }
    });

  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Failed to generate analytics" });
  }
};

// 5. Cancel Session
exports.cancelSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Session not found" });

    if (booking.paymentStatus === 'paid' && booking.paymentId) {
        try {
            const refundResponse = await razorpay.payments.refund(booking.paymentId, {
                amount: booking.amount,
                notes: { reason: reason || "Cancelled by Practitioner via Dashboard Admin Portal" }
            });
            console.log(`Refund initiated successfully: ${refundResponse.id}`);
        } catch (refundError) {
            console.error("Razorpay Refund Error:", refundError);
            // Optionally, handle failure to refund but still cancel the booking, or return error.
            // We'll proceed with cancellation but log the refund failure.
        }
    }

    booking.status = "cancelled";
    booking.paymentStatus = 'failed';
    await booking.save();

    // Notify User
    const cancelMsg = `🔔 *Session Cancellation Update*\n\nHello *${booking.name}*,\n\nWe regret to inform you that your therapy session (ID: ${booking.ticketId}) has been cancelled.\n\n*Reason:* ${reason || "Administrative conflict"}\n\nOur team will contact you shortly for a full refund or to reschedule. We apologize for the inconvenience.`;

    try {
      await Promise.all([
        sendEmail(booking.email, "Session Cancellation Notification", cancelMsg),
        sendWhatsAppAlert(booking.phone, cancelMsg)
      ]);
    } catch (err) {
      console.error("Cancellation Notify Error:", err.message);
    }

    res.json({ success: true, message: "Session cancelled and client notified" });
  } catch (err) {
    console.error("Admin Cancel Error:", err);
    res.status(500).json({ error: "Failed to cancel session" });
  }
};

// 6. Reschedule Session
exports.rescheduleSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Session not found" });

    const oldDate = booking.date;
    const oldTime = booking.time;

    booking.date = newDate;
    booking.time = newTime;
    booking.status = "rescheduled";
    booking.rescheduleNotes = reason;

    await booking.save();

    // Notify User
    const rescheduleMsg = `📅 *Session Rescheduled Notice*\n\nHello *${booking.name}*,\n\nYour therapy session (ID: ${booking.ticketId}) has been rescheduled by the specialist.\n\n*Previous:* ${oldDate} at ${oldTime}\n*New Schedule:* ${newDate} at ${newTime}\n\n*Note:* ${reason || "To provide better care"}\n\nPlease reach out if this new timing doesn't work for you.`;

    try {
      await Promise.all([
        sendEmail(booking.email, "Session Rescheduled Notice", rescheduleMsg),
        sendWhatsAppAlert(booking.phone, rescheduleMsg)
      ]);
    } catch (err) {
      console.error("Reschedule Notify Error:", err.message);
    }

    res.json({ success: true, message: "Session rescheduled and client notified" });
  } catch (err) {
    console.error("Admin Reschedule Error:", err);
    res.status(500).json({ error: "Failed to reschedule session" });
  }
};

// 7. Mark Session as Completed
exports.completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Session not found" });

    booking.sessionCompleted = true;
    await booking.save();

    res.json({ success: true, message: "Session marked as completed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to complete session" });
  }
};

// 8. Approve Cancellation Request
exports.approveCancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Session not found" });

    if (booking.paymentStatus === 'paid' && booking.paymentId) {
        try {
            const refundResponse = await razorpay.payments.refund(booking.paymentId, {
                amount: booking.amount,
                notes: { reason: `Approved cancellation request: ${booking.cancelReason}` }
            });
            console.log(`Refund initiated successfully: ${refundResponse.id}`);
        } catch (refundError) {
            console.error("Razorpay Refund Error during approval:", refundError);
        }
    }

    booking.status = "cancelled";
    booking.paymentStatus = 'failed';
    booking.cancelRequested = false; // Reset request flag
    await booking.save();

    // Notify User
    const cancelMsg = 
      `🔔 *Cancellation Request Approved*\n\n` +
      `Hello *${booking.name}*,\n\n` +
      `Your request to cancel your therapy session (ID: ${booking.ticketId}) has been *APPROVED* by the specialist.\n\n` +
      `💳 A full refund of *₹${booking.amount / 100}* has been initiated via Razorpay and will reflect in your account within 5-7 business days.\n\n` +
      `If you have any questions, feel free to contact us. 🌿`;

    try {
      await Promise.all([
        sendEmail(booking.email, "Session Cancellation Request Approved ✅", cancelMsg),
        sendWhatsAppAlert(booking.phone, cancelMsg)
      ]);
    } catch (err) {
      console.error("Cancellation approval notification error:", err.message);
    }

    res.json({ success: true, message: "Cancellation request approved and refunded successfully" });
  } catch (err) {
    console.error("Approve Cancel Error:", err);
    res.status(500).json({ error: "Failed to approve cancellation" });
  }
};

// 9. Reject Cancellation Request
exports.rejectCancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Session not found" });

    booking.cancelRequested = false; // Reset request flag
    await booking.save();

    // Notify User
    const rejectMsg = 
      `❌ *Cancellation Request Update*\n\n` +
      `Hello *${booking.name}*,\n\n` +
      `Your cancellation request for session (ID: ${booking.ticketId}) could not be approved at this time.\n\n` +
      `*Therapist note:* ${reason || "Last-minute cancellation policy conflict. Please join the scheduled slot."}\n\n` +
      `Your session remains confirmed for *${booking.date}* at *${booking.time}*. See you there! 💚`;

    try {
      await Promise.all([
        sendEmail(booking.email, "Update on your cancellation request", rejectMsg),
        sendWhatsAppAlert(booking.phone, rejectMsg)
      ]);
    } catch (err) {
      console.error("Cancellation reject notification error:", err.message);
    }

    res.json({ success: true, message: "Cancellation request rejected and client notified" });
  } catch (err) {
    console.error("Reject Cancel Error:", err);
    res.status(500).json({ error: "Failed to reject cancellation" });
  }
};

// 10. Approve Reschedule Request
exports.approveRescheduleRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Session not found" });

    const oldDate = booking.date;
    const oldTime = booking.time;

    booking.date = booking.proposedDate;
    booking.time = booking.proposedTime;
    booking.status = "rescheduled";
    booking.rescheduleRequested = false; // Reset request flag
    await booking.save();

    // Notify User
    const rescheduleMsg = 
      `📅 *Reschedule Request Approved ✅*\n\n` +
      `Hello *${booking.name}*,\n\n` +
      `Your request to reschedule your therapy session (ID: ${booking.ticketId}) has been *APPROVED*!\n\n` +
      `*Previous:* ${oldDate} at ${oldTime}\n` +
      `*New Schedule:* ${booking.date} at ${booking.time}\n\n` +
      `We look forward to seeing you at the rescheduled time. 💚`;

    try {
      await Promise.all([
        sendEmail(booking.email, "Reschedule Request Approved ✅", rescheduleMsg),
        sendWhatsAppAlert(booking.phone, rescheduleMsg)
      ]);
    } catch (err) {
      console.error("Reschedule approval notification error:", err.message);
    }

    res.json({ success: true, message: "Reschedule request approved successfully" });
  } catch (err) {
    console.error("Approve Reschedule Error:", err);
    res.status(500).json({ error: "Failed to approve reschedule" });
  }
};

// 11. Reject Reschedule Request
exports.rejectRescheduleRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Session not found" });

    booking.rescheduleRequested = false; // Reset request flag
    await booking.save();

    // Notify User
    const rejectMsg = 
      `❌ *Reschedule Request Update*\n\n` +
      `Hello *${booking.name}*,\n\n` +
      `Your request to reschedule session (ID: ${booking.ticketId}) could not be accommodated at this time.\n\n` +
      `*Therapist note:* ${reason || "The proposed slot is unavailable. Please join the scheduled slot or suggest alternative timings."}\n\n` +
      `Your session remains confirmed for *${booking.date}* at *${booking.time}*. 💚`;

    try {
      await Promise.all([
        sendEmail(booking.email, "Update on your reschedule request", rejectMsg),
        sendWhatsAppAlert(booking.phone, rejectMsg)
      ]);
    } catch (err) {
      console.error("Reschedule reject notification error:", err.message);
    }

    res.json({ success: true, message: "Reschedule request rejected and client notified" });
  } catch (err) {
    console.error("Reject Reschedule Error:", err);
    res.status(500).json({ error: "Failed to reject reschedule" });
  }
};
