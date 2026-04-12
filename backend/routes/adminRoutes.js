const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllSessions,
  getAllUsers,
  deleteUser,
  getAdminAnalytics,
  cancelSession,
  rescheduleSession,
  completeSession
} = require("../controllers/adminController");

// All admin routes are protected by both general auth and strict admin verification
router.use(authMiddleware, adminMiddleware);

// Endpoints
router.get("/sessions", getAllSessions);
router.get("/users", getAllUsers);
router.get("/analytics", getAdminAnalytics);
router.delete("/users/:id", deleteUser);
router.put("/sessions/:id/cancel", cancelSession);
router.put("/sessions/:id/reschedule", rescheduleSession);
router.put("/sessions/:id/complete", completeSession);

module.exports = router;
