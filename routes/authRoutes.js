const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const Admin = require("../models/Admin");



/* ======================
   LOGIN (USERNAME + PASSWORD)
====================== */
router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await Admin.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // 🔥 FIRST TIME → GENERATE QR
    if (!user.totpSecret) {

  const secret = speakeasy.generateSecret({
    name: "Sangharsh Admin Panel"
  });

  user.totpSecret = secret.base32;
  await user.save();

  const qr = await QRCode.toDataURL(secret.otpauth_url);

  return res.json({
    message: "Scan QR (first time only)",
    qr,
    firstTime: true
  });
}

    return res.json({
      message: "Enter OTP",
      firstTime: false
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({ message: "Server error" });

  }

});


/* ======================
   VERIFY OTP
====================== */
router.post("/verify-otp", async (req, res) => {

  try {

    const { username, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const user = await Admin.findOne({ username });

    if (!user || !user.totpSecret) {
      return res.status(400).json({ message: "QR not setup" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: String(otp),
      window: 1
    });

    console.log("OTP:", otp);
    console.log("Verified:", verified);

    // ❌ BLOCK WRONG OTP
    if (!verified) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    console.error("VERIFY ERROR:", error);

    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;
