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

router.route("/summary/sales-data").get(protect, admin, getSalesData);
router.route("/summary").get(protect, admin, getOrderSummary);
router
  .route("/")
  .get(protect, admin, getAllOrders)
  .post(protect, addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/create-razorpay-order").post(protect, createRazorpayOrder);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id/cancel").put(protect, cancelOrder);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id").get(protect, getOrderById);

export default router;
