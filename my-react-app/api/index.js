// server/index.js
import 'dotenv/config';          // ← MUST be at the very top
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite default + any others you use
  credentials: true,
}));
app.use(express.json());

// Test route (optional - helps debug)
app.get('/', (req, res) => {
  res.json({ message: 'Backend is alive 🚀' });
});

// OTP sending route
app.post('/send-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test SMTP connection (optional but very useful during debugging)
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: `"SmartGST" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SmartGST Verification OTP',
      text: `Your OTP is: ${otp}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto;">
          <h2 style="color: #4c1d95;">SmartGST Verification</h2>
          <p>Use the following OTP to verify your email:</p>
          <h1 style="letter-spacing: 8px; color: #7c3aed; font-size: 36px; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #64748b; font-size: 0.9rem;">
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log('OTP email sent → Message ID:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (err) {
    console.error('EMAIL ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: err.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log('Email user:', process.env.EMAIL_USER || '(not loaded)');
});