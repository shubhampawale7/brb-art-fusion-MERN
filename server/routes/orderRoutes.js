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
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

// --- Public / User-specific Routes ---
// These routes are for individual users and are protected by the 'protect' middleware.
router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/create-razorpay-order").post(protect, createRazorpayOrder);

// --- Admin Only Routes ---
// These routes require the user to be an admin.
router.route("/").get(protect, admin, getAllOrders);
router.route("/summary").get(protect, admin, getOrderSummary);
router.route("/summary/sales-data").get(protect, admin, getSalesData);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered); // Added 'admin' middleware for security

// --- Dynamic ID Routes (Must come last) ---
// IMPORTANT: Specific text-based routes like '/summary' must come BEFORE dynamic ID routes like '/:id'.
// Otherwise, Express will mistakenly treat 'summary' as an ID.
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);

export default router;
