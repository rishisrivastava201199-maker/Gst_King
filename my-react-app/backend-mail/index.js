// api/send-otp.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP required' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SmartGST" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your SmartGST OTP Code",
    html: `
      <div style="max-width: 600px; margin: auto; padding: 30px; background: #ffffff; border-radius: 16px; ...">
        <h2 style="color: #1e3a8a; text-align: center;">SmartGST Verification</h2>
        <p style="font-size: 18px; text-align: center;">Your one-time password (OTP) is:</p>
        <h1 style="font-size: 48px; text-align: center; color: #1e3a8a;">${otp}</h1>
        <p style="text-align: center; color: #666;">This code is valid for <strong>5 minutes</strong>.</p>
        <!-- baaki tera style aur footer -->
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send email', error: err.message });
  }
} 