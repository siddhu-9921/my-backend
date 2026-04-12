const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  orderId: String,
  service: String,
  selectedServices: [String],
  clientName: String,
  phone: String,
  description: String,
  price: Number,
  status: {
    type: String,
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", OrderSchema);