const express = require("express");
const router = express.Router();
const Order = require("../models/Order");


// CREATE ORDER
router.post("/", async (req, res) => {

  try {

    const order = new Order(req.body);

    await order.save();

    res.status(201).json({
      message: "Order saved successfully",
      order
    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error.message);
    console.error(error.stack);

    res.status(500).json({
      message: "Order save failed"
    });

  }

});


// GET ALL ORDERS
router.get("/", async (req, res) => {

  try {

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// UPDATE STATUS
router.put("/:id", async (req, res) => {

  try {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


module.exports = router;