const express = require("express");
const router = express.Router();
const multer = require("multer");
const Image = require("../models/Image");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* STORAGE */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "portfolio_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: Date.now() + "-" + file.originalname, // ✅ SAFE
  }),
});

const upload = multer({ storage });

/* UPLOAD */
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const category = req.body.category;

    if (!category) {
      return res.status(400).json({ message: "Category required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const savedImages = await Promise.all(
      req.files.map(file =>
        Image.create({
          url: file.path,                 // ✅ Cloudinary URL
          public_id: file.filename || file.public_id, // ✅ FIXED
          category
        })
      )
    );

    res.status(200).json(savedImages);

  } catch (error) {
    console.log("========== UPLOAD ERROR ==========");
    console.log(error);
    console.log("Message:", error.message);
    console.log("Stack:", error.stack);
    console.log("==================================");

    res.status(500).json({
      error: error.message || "Server error"
    });
  }
});

module.exports = router;