require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("./models/Admin");

console.log("Admin model:", Admin);

async function createAdmin() {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const hashedPassword = await bcrypt.hash("Sangam@9822", 10);

    const admin = new Admin({
      username: "sangam",
      password: hashedPassword,
      phone: "9545563314"
    });

    await admin.save();

    console.log("Admin created successfully");

    mongoose.disconnect();

  } catch (error) {

    console.error("Error creating admin:", error);

  }

}

createAdmin();