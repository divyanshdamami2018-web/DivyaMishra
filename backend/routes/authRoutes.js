const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Get User (Auth required)
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
