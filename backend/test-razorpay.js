require("dotenv").config();
const Razorpay = require("razorpay");

if (
  !process.env.RAZORPAY_KEY ||
  process.env.RAZORPAY_KEY === "your_key" ||
  !process.env.RAZORPAY_SECRET ||
  process.env.RAZORPAY_SECRET === "your_secret"
) {
  console.log("FAILED: ❌ Razorpay credentials in .env are still set to placeholders or missing.");
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// Try creating a test order of 1 INR (100 paise)
razorpay.orders.create({
  amount: 100,
  currency: "INR",
  receipt: "receipt_test_1"
})
.then(order => {
  console.log("SUCCESS: Razorpay Connected ✅");
  console.log("Test Order ID:", order.id);
  process.exit(0);
})
.catch(err => {
  console.log("FAILED: ❌ Razorpay API Error:", err.error ? err.error.description : err.message);
  process.exit(1);
});
