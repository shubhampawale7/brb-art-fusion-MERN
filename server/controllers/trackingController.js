import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc    Receive tracking updates from shipping partner
// @route   POST /api/tracking-webhook
// @access  Public (but should be a secret URL)
const trackingWebhook = asyncHandler(async (req, res) => {
  // Shiprocket sends data in the request body
  const trackingData = req.body;
  console.log("Received Webhook:", trackingData);

  // Find the order in your database using the order_id from Shiprocket
  const order = await Order.findOne({
    "paymentResult.id": trackingData.order_id,
  });

  if (order) {
    // Check the new status from the webhook data
    const newStatus = trackingData.current_status;

    // Example logic: if the status is "DELIVERED", update your order
    if (newStatus === "DELIVERED") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();
      console.log(`Order ${order._id} marked as delivered.`);
    }
    // You can add more logic here for other statuses like 'SHIPPED', etc.
  }

  // You must send a 200 OK response back to Shiprocket to acknowledge receipt
  res.status(200).send("Webhook Received");
});

export { trackingWebhook };
