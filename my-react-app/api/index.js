import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST allowed" });
    }

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "rishisrivastava201199@gmail.com",
        pass: "ywdrbsnnlqwvsupo"
      }
    });

    await transporter.sendMail({
      from: "SmartGST <rishisrivastava201199@gmail.com>",
      to: email,
      subject: "Your SmartGST OTP",
      html: `<h1>${otp}</h1>`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
