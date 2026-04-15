const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

/* 🔍 DEBUG (IMPORTANT) */
console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUD_NAME ? "SET" : "❌ MISSING",
  api_key: process.env.CLOUD_KEY ? "SET" : "❌ MISSING",
  api_secret: process.env.CLOUD_SECRET ? "SET" : "❌ MISSING",
});

module.exports = cloudinary;