const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/adminMiddleware");
const {
  getAllSessions,
  getAllUsers,
  deleteUser,
  getAdminAnalytics,
  cancelSession,
  rescheduleSession,
  completeSession,
  approveCancelRequest,
  rejectCancelRequest,
  approveRescheduleRequest,
  rejectRescheduleRequest
} = require("../controllers/adminController");

// All admin routes are protected by both general auth and strict RBAC verification
router.use(authMiddleware, authorizeRoles('practitioner', 'billing_admin', 'admin'));

// Endpoints
router.get("/sessions", getAllSessions);
router.get("/users", getAllUsers);
router.get("/analytics", getAdminAnalytics);
router.delete("/users/:id", deleteUser);
router.put("/sessions/:id/cancel", cancelSession);
router.put("/sessions/:id/reschedule", rescheduleSession);
router.put("/sessions/:id/complete", completeSession);

router.put("/sessions/:id/approve-cancel", approveCancelRequest);
router.put("/sessions/:id/reject-cancel", rejectCancelRequest);
router.put("/sessions/:id/approve-reschedule", approveRescheduleRequest);
router.put("/sessions/:id/reject-reschedule", rejectRescheduleRequest);

module.exports = router;
