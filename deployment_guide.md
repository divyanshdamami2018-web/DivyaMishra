# Launch Guide: MindfulPath Production 🚀

Follow these steps to deploy your platform to the world!

## 📤 1. Push to GitHub (Mandatory Step)
The easiest way to deploy is to upload your local code to a private GitHub repository.
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands in your project folder (using Git Bash or Terminal):
   ```bash
   git init
   git add .
   git commit -m "MindfulPath Production Release"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

---

## 🏗️ 2. Deploy Backend (Render)
Go to [Render.com](https://render.com/) and create a **Web Service**.
1. Connect your GitHub repository.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. **Environment Variables**: Add everything from your `backend/.env`.
   - `MONGO_URI`, `RAZORPAY_KEY`, `RAZORPAY_SECRET`, `TWILIO_SID`, `TWILIO_AUTH`, etc.
6. Once deployed, copy your **Render URL** (e.g., `https://mindfulpath-backend.onrender.com`).

---

## 🎨 3. Deploy Frontend (Netlify)
Go to [Netlify.com](https://www.netlify.com/) and create a **New Site from GitHub**.
1. Connect your GitHub repository.
2. **Base Directory**: (Leave empty).
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Paste your **Render URL** from Step 2, adding `/api` at the end (e.g., `https://mindfulpath-backend.onrender.com/api`).
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID.
6. Deploy!

---

## ✅ 4. Final Verification
- Once both are live, visit your Netlify URL.
- Test the Login, Booking, and Dashboard.
- **You are now LIVE!** 🌿🏆

> [!NOTE]
> **Domain Hosting**: If you have a custom domain (like `mindfulpath.com`), you can easily connect it in the Netlify domain settings.
