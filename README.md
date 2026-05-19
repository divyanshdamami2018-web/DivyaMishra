# 🌿 Mental Health with Divya Mishra

A full-stack, production-ready web application for a clinical psychologist. This platform facilitates therapy session bookings, secure user authentication, an administrative dashboard, and automated multi-channel notifications (WhatsApp & Email).

---

## 🚀 Tech Stack

### Frontend (Client-Side)
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS v4 (with custom mesh gradients and glassmorphism)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios (with custom token interceptors)

### Backend (Server-Side)
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Payment Gateway:** Razorpay Integration
- **Communications:** Twilio (WhatsApp) & Nodemailer (Gmail HTML emails)

---

## 🌟 Comprehensive Features & Functionalities

### 1. User Facing Features (Frontend Client)
- **Dynamic Landing Page (`Home.jsx`)**: Animated Hero section with stats, holistic care service highlights, professional profile of the psychologist, and a 4-step "How it Works" guide.
- **Therapy Services (`Therapy.jsx`)**: Detailed breakdown of 6 core clinical services (CBT, Trauma-informed care, Mindfulness, Relationship counseling, Self-esteem work, Career stress) and therapeutic philosophy.
- **Mental Health Blog (`Blog.jsx`)**: A reading hub with category filters (Anxiety, Mindfulness, Self-Esteem, Relationships), featured articles, and a grid of mental health insights.
- **Career Counseling (`Career.jsx`)**: Dedicated page for career guidance, psychometric assessments, and interview preparations.
- **Contact System (`Contact.jsx`)**: User inquiry form that automatically emails the admin and sends a confirmation email back to the user.
- **Multi-Step Booking Flow (`Booking.jsx`)**: 
  - Date & Time selection (with past-date restriction and slot conflict prevention).
  - Detailed pre-session clinical intake assessment (Age, Gender, Occupation, Primary Concern, Mood Index 1-10, Description).
  - Secure payment gateway integration (Razorpay).
- **Post-Booking Success (`Success.jsx`)**: Clean confirmation page generating a unique Ticket ID and outlining next steps for the Google Meet link.
- **Session Feedback (`Feedback.jsx`)**: Star-rating system and text review submission for completed sessions, automatically notifying the admin upon submission.

### 2. Client Dashboard (`Dashboard.jsx`)
- **Protected Access**: Only accessible to logged-in users via JWT validation.
- **Session Tracking**: Split views for "Upcoming" and "Past" (completed) sessions.
- **WhatsApp Integration**: "Get Session Link" button directly opens a pre-filled WhatsApp message to the therapist, containing the specific Ticket ID and schedule.
- **Feedback Prompt**: Direct link to review past sessions.
- **Live Stats**: Displays total booked sessions and total completed sessions.

### 3. Admin Management Suite (`AdminDashboard.jsx`)
- **Strictly Protected**: Requires both valid JWT (`authMiddleware`) AND admin role validation (`adminMiddleware`).
- **Live Auto-Refresh**: Dashboard automatically polls for new data every 30 seconds.
- **Overview Dashboard**: High-level stats (Total Sessions, Upcoming, Total Revenue, Average Rating) and a quick view of the 5 most recent activities.
- **Comprehensive Session Control**:
  - **View Intake**: Read the client's private clinical assessment (mood index, concerns, background).
  - **Reschedule**: Change session date/time and provide a reason. Automatically sends WhatsApp & Email alerts to the client with the new schedule.
  - **Cancel**: Cancel a session and provide a reason. Automatically sends cancellation alerts to the client.
  - **Complete**: Mark a session as done.
- **Client/User Management**: View all registered accounts, their join dates, and delete accounts safely without deleting their historical booking records.
- **Clinical Analytics**: Real-time charts showing distribution of Primary Concerns, Client Occupations, Income levels, and Monthly Revenue.
- **Data Export**: Export all session data to a CSV file for offline accounting.

### 4. Backend Engine & Security
- **Authentication**: JWT-based stateless authentication with `bcryptjs` password hashing.
- **Payment Security**: Cryptographic HMAC SHA256 signature verification to prevent Razorpay payment spoofing (`verifyPayment`).
- **Slot Conflict Engine**: Database-level checks to prevent two users from booking the exact same date and time.
- **Automated Notification Engine**: Uses `Promise.all` to concurrently fire Nodemailer HTML Emails and Twilio WhatsApp messages without blocking the main thread.
- **Phone Sanitization**: Automatically cleans and formats Indian phone numbers to prevent Twilio routing errors.
- **CORS Preflight**: Fully configured Express CORS middleware to handle secure cross-origin requests.

---

## 📁 Project Architecture

### Frontend Structure (`/src`)
```
src/
├── components/         # Reusable UI (Navbar, Footer, InputField, Loader)
├── context/            # React Context (AuthContext.jsx for global auth state)
├── pages/              # Main Route Views
│   ├── AdminDashboard.jsx # Protected Admin Suite
│   ├── Dashboard.jsx      # Client Portal
│   ├── Home, Therapy, Blog, Career, Contact, etc.
│   └── Booking, Success, Feedback (Booking Flow)
├── services/           # External Communications
│   └── api.js          # Axios setup with request/response interceptors
├── App.jsx             # Route definitions and layout wrapper
├── main.jsx            # React Entry point
└── index.css           # Global Tailwind tokens and custom CSS animations
```

### Backend Structure (`/backend`)
```
backend/
├── controllers/        # Business Logic
│   ├── adminController.js   # Analytics, cancellations, rescheduling
│   ├── authController.js    # Login, signup, JWT generation
│   └── bookingController.js # Razorpay verify, feedback, slot checking
├── middleware/         # Security
│   ├── adminMiddleware.js   # Checks if req.user.role === 'admin'
│   └── authMiddleware.js    # Verifies Bearer JWT token
├── models/             # MongoDB Schemas
│   ├── Booking.js
│   └── User.js
├── routes/             # Express API Endpoints
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   └── bookingRoutes.js
├── services/           # Third-party Integrations
│   ├── emailService.js      # Nodemailer with HTML templates
│   └── whatsappService.js   # Twilio API integration
└── server.js           # Server initialization, CORS, DB connect
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the `/backend` folder with the following keys:

```env
# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=Divyamishra

# Payments (Razorpay)
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Email (Nodemailer - use Google App Passwords)
EMAIL=your_email@gmail.com
PASS=your_google_app_password

# WhatsApp (Twilio)
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH=your_twilio_auth_token

# Admin Details (Receives alerts)
ADMIN_EMAIL=admin_email@gmail.com
ADMIN_PHONE=9929814206

# Security
JWT_SECRET=your_super_secret_jwt_string
PORT=5000
```

---

## 🛠️ How to Run Locally

1. **Install Dependencies**
   - Root directory: `npm install`
   - Backend directory: `cd backend && npm install`

2. **Start the Backend**
   - `cd backend`
   - `npm start`
   - Server runs on `http://localhost:5000`

3. **Start the Frontend**
   - Open a new terminal in the root directory.
   - `npm run dev`
   - Frontend runs on `http://localhost:5173`

---

## 🧠 Concepts to Study & Improve (For AI / Developer)

If you are studying this codebase with Gemini AI, here are some advanced concepts implemented here to focus on:

1. **Axios Interceptors (`api.js`)**: Notice how tokens are automatically injected into requests, and how `401 Unauthorized` responses automatically log the user out.
2. **MongoDB Aggregations / Reductions (`adminController.js`)**: Look at how `getAdminAnalytics` processes arrays of bookings to generate demographic statistics.
3. **Promise.all Notification Pattern**: Look in `bookingController.js` to see how Email and WhatsApp messages are dispatched concurrently without blocking each other.
4. **Tailwind v4 Setup**: Notice the lack of a traditional `tailwind.config.js`. V4 uses CSS variables inside `index.css` under the `@theme` directive.
5. **HMAC SHA256 Verification**: Look at `verifyPayment` to see how Razorpay signatures are cryptographically verified to prevent payment spoofing.
