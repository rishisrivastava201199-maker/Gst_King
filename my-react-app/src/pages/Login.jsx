// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";


export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP states
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateToDashboard = () => {
  const userData = {
    name: isSignup ? name : loginEmail.split("@")[0],
    email: isSignup ? email : loginEmail,
    role: isSignup ? "New User" : "User",
    company: "Raj & Company",
  };

  localStorage.setItem("token", "smartgst-user-token");
  localStorage.setItem("user", JSON.stringify(userData));
  navigate("/user");
};


  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password.");
      return;
    }
    navigateToDashboard();
  };

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setLoading(true);

    try {
      const res = awaitfetch("https://smartgst-backend.onrender.com/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, otp }),
});


      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setShowOtpSection(true);
        alert("OTP sent successfully! Check your email.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      alert("Invalid OTP!");
      setEnteredOtp("");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    navigateToDashboard();
  };

  return (
    <div className="smartgst-login-container">
      {/* Left Side - Image */}
      <div className="smartgst-image-half">
  <div className="image-wrapper">   {/* ← yeh naya div add kar */}
    <img src="/tax.jpg" alt="SmartGST" className="smartgst-bg-image" />
  </div>
  <div className="smartgst-overlay">
    <h1>SmartGST</h1>
    <p>Powered by Sharma & Co Chartered Accountants</p>
  </div>
</div>


      {/* Right Side - Form */}
      <div className="smartgst-form-half">
        <div className="smartgst-login-card">
          <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p className="smartgst-subtitle">
            {isSignup ? "Register to access SmartGST" : "Login to your dashboard"}
          </p>

          {/* Login Form */}
          {!isSignup ? (
            <form onSubmit={handleLogin} className="smartgst-form">
              <input
                type="email"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button type="submit" className="smartgst-btn">
                LOGIN
              </button>

              <div className="smartgst-links">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignup(true);
                  }}
                >
                  New user? Create account
                </a>
              </div>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={(e) => e.preventDefault()} className="smartgst-form">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={otpSent}
                required
              />

              <div className="smartgst-email-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent}
                  required
                />
                {!otpSent && email.includes("@") && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="smartgst-send-btn"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                )}
                {otpSent && (
                  <small className="smartgst-otp-sent">
                    ✓ OTP Sent to {email}
                  </small>
                )}
              </div>

              {showOtpSection && (
                <div className="smartgst-otp-section">
                  <p>Enter 6-digit OTP</p>
                  <input
                    type="text"
                    placeholder="••••••"
                    value={enteredOtp}
                    onChange={(e) =>
                      setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    autoFocus
                  />
                </div>
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!otpSent}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!otpSent}
                required
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="smartgst-btn"
                disabled={!otpSent || enteredOtp.length !== 6}
              >
                Verify & Sign Up
              </button>

              <div className="smartgst-links">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignup(false);
                  }}
                >
                  Already have an account? Login
                </a>
              </div>
            </form>
          )}

          <p className="smartgst-copyright">
            © 2025 SmartGST - Powered by Sharma & Co
          </p>
        </div>
      </div>
    </div>
  );
}