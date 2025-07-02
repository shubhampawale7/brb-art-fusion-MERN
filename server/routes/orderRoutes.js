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
  updateOrderTracking,
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

// --- ADMIN-ONLY ROUTES (Specific text routes come first) ---
router.route("/summary/sales-data").get(protect, admin, getSalesData);
router.route("/summary").get(protect, admin, getOrderSummary);
router.route("/").get(protect, admin, getAllOrders);

// --- USER-SPECIFIC ROUTES ---
router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/create-razorpay-order").post(protect, createRazorpayOrder);

// --- DYNAMIC ID ROUTES (These must come last) ---
// The more specific routes with actions like 'pay' or 'tracking' come first.
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/cancel").put(protect, cancelOrder);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id/tracking").put(protect, admin, updateOrderTracking); // This now exists

// The most generic route with just the ID must be last.
router.route("/:id").get(protect, getOrderById);

export default router;
