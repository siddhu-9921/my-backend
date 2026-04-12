const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  otp: String,
  otpExpiry: Date,

  totpSecret: String

});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;