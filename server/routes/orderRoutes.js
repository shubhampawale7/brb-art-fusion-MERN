import express from "express";
const router = express.Router();

import { createRazorpayOrder } from "../controllers/paymentController.js";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
  getOrderSummary,
  getSalesData,
  cancelOrder,
} from "../controllers/orderController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

// Combine GET and POST on the root path
router
  .route("/")
  .get(protect, admin, getAllOrders)
  .post(protect, addOrderItems);

router.route("/myorders").get(protect, getMyOrders);
router.route("/create-razorpay-order").post(protect, createRazorpayOrder);

// Admin routes
router.route("/summary").get(protect, admin, getOrderSummary);
router.route("/summary/sales-data").get(protect, admin, getSalesData);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

// Dynamic routes (keep at the end)
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/cancel").put(protect, cancelOrder);

export default router;
