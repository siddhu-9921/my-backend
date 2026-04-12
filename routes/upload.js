const express = require('express')
const router = express.Router()
const multer = require('multer')
const Image = require('../models/Image')
const fs = require('fs')
const path = require('path')

/* ======================
   MULTER STORAGE CONFIG
====================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {

    const cleanName = file.originalname
      .replace(/\s+/g, "_")   // remove spaces
      .replace(/[()]/g, "");  // remove brackets

    cb(null, Date.now() + "-" + cleanName);
  }
});

const upload = multer({ storage: storage })


/* ======================
   UPLOAD IMAGES
====================== */

router.post('/', upload.array('images', 10), async (req, res) => {

  try {

    const category = req.body.category

    if (!category) {
      return res.status(400).json({ message: "Category required" })
    }

    const savedImages = await Promise.all(

      req.files.map(file =>

        Image.create({
          filename: file.filename,
          path: `uploads/${file.filename}`,
          category: category
        })

      )

    )

    res.status(200).json(savedImages)

  } catch (error) {

    console.error(error)
    res.status(500).json({ error: error.message })

  }

})


/* ======================
   GET IMAGES
====================== */

router.get('/', async (req, res) => {

  try {

    const { category } = req.query

    const filter = category ? { category } : {}

    const images = await Image.find(filter).sort({ createdAt: -1 })

    res.json(images)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


/* ======================
   DELETE SELECTED IMAGE
====================== */

router.delete('/:id', async (req, res) => {

  try {

    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const filePath = path.join(__dirname, '../', image.path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

module.exports = router