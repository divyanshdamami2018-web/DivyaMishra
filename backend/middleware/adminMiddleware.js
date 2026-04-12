const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    // 1. Check if user exists (from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // 2. Fetch full user to check role and email
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Strict Admin Verification
    // Restricted to: dpsychologist01@gmail.com
    const ADMIN_EMAIL = "dpsychologist01@gmail.com";

    if (user.role !== "admin" || user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Forbidden: Administrative rights required" });
    }

    next();
  } catch (err) {
    console.error("Admin Middleware Error:", err);
    res.status(500).json({ error: "Server error during admin verification" });
  }
};

module.exports = adminMiddleware;
