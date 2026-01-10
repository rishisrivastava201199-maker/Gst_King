// backend/index.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());           // ya specific origin daal sakta hai production mein
app.use(express.json());

// ---------------- Gmail setup same ----------------
const YOUR_EMAIL = "rishisrivastava201199@gmail.com";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: YOUR_EMAIL,
    pass: "ywdrbsnnlqwvsupo",   // app password
  },
});

// Test route
app.get("/", (req, res) => {
  res.send("🚀 SmartGST Backend is Running on Vercel!");
});

// OTP route same
app.post("/send-otp", async (req, res) => {
  // ... tera pura code same rahega
});

// ---------------- Important for Vercel ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});