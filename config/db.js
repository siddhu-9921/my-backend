const mongoose = require("mongoose");

const connectDB = async () => {

  try {

    await mongoose.connect(
      "mongodb+srv://admin:siddhu9822@imageupload.10sso5l.mongodb.net/designDB?retryWrites=true&w=majority"
    );

    console.log("MongoDB Atlas Connected");

  } catch (error) {

    console.error("MongoDB connection error:", error);
    process.exit(1);

  }

};

module.exports = connectDB;