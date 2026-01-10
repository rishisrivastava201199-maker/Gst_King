import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { email, otp } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "rishisrivastava201199@gmail.com",
      pass: "ywdrbsnnlqwvsupo",
    },
  });

  try {
    await transporter.sendMail({
      from: "SmartGST <rishisrivastava201199@gmail.com>",
      to: email,
      subject: "OTP",
      html: `<h1>${otp}</h1>`,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}
