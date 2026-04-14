const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/Image');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

/* ======================
   STORAGE CONFIG
====================== */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_uploads",
    public_id: (req, file) => Date.now() + "-" + file.originalname
  },
});

const upload = multer({ storage });

/* ======================
   UPLOAD IMAGES
====================== */

router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    console.log('Upload request body:', req.body);
    console.log('Upload files:', req.files ? req.files.map(f => ({name: f.originalname, path: f.path, filename: f.filename})) : 'NO FILES');
    
    const category = req.body.category;

    if (!category) {
      console.log('Missing category');
      return res.status(400).json({ message: "Category required" });
    }

    if (!req.files || req.files.length === 0) {
      console.log('No files received');
      return res.status(400).json({ message: "No files uploaded" });
    }

    const savedImages = [];

    for (const file of req.files) {
      console.log(`Saving image: ${file.filename}`);
      const newImage = await Image.create({
        url: file.path,
        public_id: file.filename,
        category: category,
      });

      savedImages.push(newImage);
    }

    console.log(`Upload success: ${savedImages.length} images saved`);
    res.status(200).json(savedImages);

  } catch (error) {
    console.error("UPLOAD ERROR:", error.message);
    console.error(error.stack);
    res.status(500).json({
      error: error.message || "Server error"
    });
  }
});

/* ======================
   GET IMAGES
====================== */

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const images = await Image.find(filter).sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ======================
   DELETE IMAGE
====================== */

router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;