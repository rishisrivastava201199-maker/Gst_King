const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// CHANGE THESE WITH YOUR GMAIL
const EMAIL_USER = "yourgmail@gmail.com"; // Your Gmail
const EMAIL_PASS = "your-app-password";   // Gmail App Password (not normal password)

let currentOtp = "";
let currentEmail = "";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Send OTP via Email
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // Generate 6-digit OTP
  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
  currentEmail = email;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "SmartGST - Your Verification Code",
    html: `
      <h2>Your SmartGST Verification Code</h2>
      <p>Use this OTP to complete your signup:</p>
      <h1 style="font-size: 32px; letter-spacing: 8px; color: #1e3a8a;">${currentOtp}</h1>
      <p>This code is valid for 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent to ${email}: ${currentOtp}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (otp === currentOtp) {
    currentOtp = ""; // Clear after use
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

app.listen(5000, () => console.log("Email OTP Backend running on port 5000"));