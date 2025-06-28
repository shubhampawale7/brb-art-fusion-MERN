import Razorpay from "razorpay";
import "dotenv/config";

// @desc    Create a razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      res.status(500);
      throw new Error("Something went wrong");
    }

    res.json(order);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

export { createRazorpayOrder };
