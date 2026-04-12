require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const testRoute = require("./routes/test");

const app = express();

// Update CORS to be more flexible for production (allows Netlify)
app.use(cors({
  origin: "*", // In strict production, you'd put your Netlify URL here
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

app.use("/api", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", testRoute);

// Follow-Up System
cron.schedule("0 * * * *", async () => {
  console.log("Running follow-up job...");
});

// Dynamic Port for Render/Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
