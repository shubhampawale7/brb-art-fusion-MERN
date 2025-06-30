import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import "dotenv/config";

// @desc    Create a razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Math.round(amount * 100), // Ensure amount is an integer
    currency: "INR",
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  const order = await instance.orders.create(options);

  if (!order) {
    res.status(500);
    throw new Error("Something went wrong while creating Razorpay order");
  }

  res.json(order);
});

export { createRazorpayOrder };
