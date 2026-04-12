require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const testRoute = require("./routes/test");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Must be FIRST before any routes — handles preflight OPTIONS requests
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight for all routes

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => {
    console.error("MongoDB Connection Error ❌:", err.message);
    process.exit(1); // Exit if DB can't connect - Render will restart it
  });

// ── Health Check (test this URL first when debugging) ────────────────────────
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", testRoute);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// ── Follow-Up Cron ────────────────────────────────────────────────────────────
cron.schedule("0 * * * *", async () => {
  console.log("Running follow-up job...");
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
