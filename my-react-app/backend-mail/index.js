// server.js - Full Working Backend for SmartGST OTP System

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Allow your React frontend to connect
app.use(
  cors()
);
app.use(express.json());

// === REPLACE THIS WITH YOUR REAL GMAIL ===
const YOUR_EMAIL = "rishisrivastava201199@gmail.com"; // ← CHANGE THIS TO YOUR ACTUAL GMAIL

// Nodemailer setup using your Gmail + App Password
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: "rishisrivastava201199@gmail.com",                    // Your Gmail
    pass: "ywdrbsnnlqwvsupo",            // Your 16-digit App Password (already correct)
  },
});

// Test route - visit http://localhost:5000 in browser
app.get("/", (req, res) => {
  res.send(`
    <h1 style="text-align:center; color:#1e3a8a; margin-top:100px;">
      🚀 SmartGST Backend is Running Successfully!
    </h1>
    <p style="text-align:center;">OTP system is ready. Go to your app and test signup.</p>
  `);
});

// Main OTP Sending Route
app.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }

  // Email content
  const mailOptions = {
    from: `"SmartGST" <${YOUR_EMAIL}>`, // Sender name + your email
    to: email,                          // ← Goes to whatever email user typed
    subject: "Your SmartGST OTP Code",
    html: `
      <div style="max-width: 600px; margin: auto; padding: 30px; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
        <h2 style="color: #1e3a8a; text-align: center;">SmartGST Verification</h2>
        <p style="font-size: 18px; text-align: center; color: #333;">
          Your one-time password (OTP) is:
        </p>
        <h1 style="font-size: 48px; letter-spacing: 15px; text-align: center; color: #1e3a8a; font-weight: bold; margin: 30px 0;">
          ${otp}
        </h1>
        <p style="text-align: center; color: #666;">
          This code is valid for <strong>5 minutes</strong>.<br>
          Do not share it with anyone.
        </p>
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        <p style="text-align: center; color: #999; font-size: 14px;">
          © 2025 SmartGST - Powered by Sharma & Co
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP successfully sent to: ${email}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Backend server running at http://localhost:${PORT}`);
  console.log(`🔗 Open this URL to test: http://localhost:${PORT}\n`);
});