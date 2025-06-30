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

// --- Admin Only Routes ---
// We place the most specific routes first.
router.route("/").get(protect, admin, getAllOrders);
router.route("/summary").get(protect, admin, getOrderSummary);
router.route("/summary/sales-data").get(protect, admin, getSalesData);

// --- Private User Routes ---
router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/create-razorpay-order").post(protect, createRazorpayOrder);

// --- Dynamic Routes (with an :id) ---
// These must come after the specific text-based routes above.
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/cancel").put(protect, cancelOrder);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
