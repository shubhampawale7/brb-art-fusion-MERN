import express from "express";
const router = express.Router();
import { createRazorpayOrder } from "../controllers/paymentController.js";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered, // <-- Import new function
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js"; // <-- Import admin middleware

// The route for creating an order is now separate and only needs 'protect'
router.route("/").post(protect, addOrderItems);
// This new route gets all orders and requires admin access
router.route("/").get(protect, admin, getAllOrders);

router.use(protect); // All routes below are protected
router.route("/myorders").get(getMyOrders);
router.route("/create-razorpay-order").post(createRazorpayOrder);
router.route("/:id").get(getOrderById);
router.route("/:id/pay").put(updateOrderToPaid);
router.route("/:id/deliver").put(updateOrderToDelivered);

export default router;
