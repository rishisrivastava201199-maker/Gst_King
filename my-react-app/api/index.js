// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: true,          // allow all origins (Vercel safe)
  credentials: true,
}));
app.use(express.json());

/* =======================
   TEST ROUTE
======================= */
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend is alive 🚀' });
});

/* =======================
   SEND OTP ROUTE
======================= */
app.post('/send-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // Debug env (remove later)
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify SMTP
    await transporter.verify();

    // Send OTP mail
    await transporter.sendMail({
      from: `"SmartGST" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'SmartGST Email Verification OTP',
      text: `Your OTP is ${otp}. This OTP is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial; padding:20px">
          <h2 style="color:#4c1d95">SmartGST Verification</h2>
          <p>Your One-Time Password (OTP):</p>
          <h1 style="letter-spacing:6px; color:#7c3aed">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
          <p style="color:#64748b;font-size:12px">
            If you didn’t request this, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });

  } catch (err) {
    console.error('❌ OTP ERROR:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: err.message,
    });
  }
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
