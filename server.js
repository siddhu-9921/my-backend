require("dotenv").config();

const express = require("express");
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

/* ======================
   CONNECT DATABASE
====================== */
connectDB();

/* ======================
   MIDDLEWARE
====================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false, // 🔥 THIS FIXES YOUR ERROR
  })
);
app.use(morgan("dev"));

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://sangharsh-graphic-website.vercel.app"
  ],
  credentials: true
}));


/* ======================
   ROUTES
====================== */
app.use("/api/totp", totpRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", authRoutes);

/* ======================
   ROOT CHECK
====================== */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

/* ======================
   IMAGE ROUTES (ADD BOTH)
====================== */

// ✅ GET ALL IMAGES
app.get("/api/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET BY CATEGORY
app.get("/api/images/:category", async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category);

    const images = await Image.find({
      category: { $regex: new RegExp(`^${category}$`, "i") }
    });

    res.json(images);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});