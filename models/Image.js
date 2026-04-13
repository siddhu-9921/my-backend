const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
  url: String,   // 🔥 use url instead of filename/path
  category: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', ImageSchema)