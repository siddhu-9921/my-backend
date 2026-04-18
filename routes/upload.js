const express = require("express");
const router = express.Router();
const multer = require("multer");
const Image = require("../models/Image");
const cloudinary = require("../config/cloudinary");

/* ======================
   MULTER (MEMORY STORAGE)
====================== */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* ======================
   UPLOAD IMAGES (FIXED)
====================== */
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const category = req.body.category;

    console.log("Category:", category);
    console.log("Files received:", req.files?.length);

    if (!category) {
      return res.status(400).json({ message: "Category required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    /* 🔥 Upload to Cloudinary */
    const uploadedImages = await Promise.all(
      req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "designs_uploads",
              public_id: Date.now() + "-" + file.originalname,
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary Error:", error);
                return reject(error);
              }
              resolve(result);
            }
          );

          stream.end(file.buffer);
        });
      })
    );

    /* 🔥 Save in MongoDB */
    const savedImages = await Promise.all(
      uploadedImages.map(img =>
        Image.create({
          url: img.secure_url.replace(
            "/upload/",
            "/upload/w_800,q_auto,f_auto/"
          ),
          public_id: img.public_id,
          category: category,
        })
      )
    );

    console.log("Saved Images:", savedImages.length);

    res.status(200).json(savedImages);

  } catch (error) {
    console.error("========== UPLOAD ERROR ==========");
    console.error(error);
    console.error("==================================");

    res.status(500).json({
      error: error.message || "Server error",
    });
  }
});

/* ======================
   GET IMAGES
====================== */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const images = await Image.find(filter).sort({ createdAt: -1 });

    res.json(images);

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ======================
   DELETE IMAGE
====================== */
router.delete("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    /* 🔥 Delete from Cloudinary */
    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    /* 🔥 Delete from DB */
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;