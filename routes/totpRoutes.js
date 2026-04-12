const express = require("express");
const router = express.Router();
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const Admin = require("../models/Admin");

router.get("/generate-qr/:username", async (req, res) => {

  const user = await Admin.findOne({ username: req.params.username });

  if (!user) return res.status(404).json({ message: "User not found" });

  // ✅ ONLY GENERATE ONCE
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

  // ✅ Already exists → DO NOT GENERATE AGAIN
  return res.json({
    message: "Enter OTP",
    firstTime: false
  });

});

module.exports = router;