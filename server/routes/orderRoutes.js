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

// ADMIN-ONLY ROUTES (Specific text routes come first)
router.route("/summary/sales-data").get(protect, admin, getSalesData);
router.route("/summary").get(protect, admin, getOrderSummary);
router.route("/").get(protect, admin, getAllOrders);

// USER-SPECIFIC ROUTES
router.route("/").post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/create-razorpay-order").post(protect, createRazorpayOrder);

// DYNAMIC ID ROUTES (These must come last)
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/cancel").put(protect, cancelOrder);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
