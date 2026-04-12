require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/upload");
const orderRoutes = require("./routes/orderRoutes");
const totpRoutes = require("./routes/totpRoutes");

const Image = require("./models/Image");

const app = express();

/* Connect database */
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/totp", totpRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", authRoutes);


app.get("/api/images/:category", async (req, res) => {
  try {
    const images = await Image.find({ category: req.params.category });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Start server */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});