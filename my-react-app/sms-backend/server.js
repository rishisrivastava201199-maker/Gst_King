const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// YOUR REAL VALUES
const MSG91_AUTH_KEY = "484994T6ANOqyr9V5694fd2efP1";
const DLT_TEMPLATE_ID = "694fd50a6ceab744832d65e5";
const SENDER_ID = "9122";

// Send OTP (MSG91 generates OTP)
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "Invalid 10-digit mobile number" });
  }

  const url = "https://api.msg91.com/api/sendotp.php";

  const params = new URLSearchParams({
    authkey: MSG91_AUTH_KEY,
    mobile: `91${phone}`,
    message: "Your SmartGST verification code is ##OTP##. Valid for 10 minutes. Do not share with anyone.", // Exact approved text with placeholder
    sender: SENDER_ID,
    DLT_TE_ID: DLT_TEMPLATE_ID,
    otp_length: "4"
  });

  try {
    const response = await axios.get(`${url}?${params}`);

    console.log("MSG91 Response:", response.data);

    if (response.data.type === "success") {
      console.log(`OTP SENT by MSG91 to 91${phone}`);
      res.json({ success: true });
    } else {
      res.status(500).json({ error: response.data.message || "Failed" });
    }
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed" });
  }
});

// Verify OTP (MSG91 verifies)
app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body; // Need phone too

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP required" });
  }

  const url = "https://api.msg91.com/api/v5/otp/verify";

  const params = new URLSearchParams({
    authkey: MSG91_AUTH_KEY,
    mobile: `91${phone}`,
    otp: otp
  });

  try {
    const response = await axios.get(`${url}?${params}`);

    console.log("Verify Response:", response.data);

    if (response.data.type === "success") {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: response.data.message || "Invalid OTP" });
    }
  } catch (err) {
    console.error("Verify Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.listen(5000, () => console.log("Backend running - MSG91 handles OTP!"));