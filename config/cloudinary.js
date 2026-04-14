const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUD_NAME ? 'SET' : 'MISSING',
  api_key: process.env.CLOUD_KEY ? 'SET' : 'MISSING',
  api_secret: process.env.CLOUD_SECRET ? 'SET' : 'SET'
});

module.exports = cloudinary;
