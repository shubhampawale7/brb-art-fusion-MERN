import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import crypto from "crypto";

// All functions are now wrapped in asyncHandler for clean, robust error handling

// @desc    Create a new order
// @route   POST /api/orders
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.images[0],
        price: item.price,
        product: item._id,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: paymentResult.id,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        signature: paymentResult.signature,
      },
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Get dashboard summary
// @route   GET /api/orders/summary
const getOrderSummary = asyncHandler(async (req, res) => {
  const ordersSummary = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  const totalOrders = await Order.countDocuments({});
  const totalUsers = await User.countDocuments({ isAdmin: false });
  const totalProducts = await Product.countDocuments({});

  res.status(200).json({
    totalSales: ordersSummary.length > 0 ? ordersSummary[0].totalSales : 0,
    numOrders: totalOrders,
    numUsers: totalUsers,
    numProducts: totalProducts,
  });
});

// @desc    Get sales data for charts
// @route   GET /api/orders/summary/sales-data
const getSalesData = asyncHandler(async (req, res) => {
  const salesData = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.status(200).json(salesData);
});

// @desc    Get all orders
// @route   GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const limit = req.query.limit ? Number(req.query.limit) : 0;

  const count = await Order.countDocuments({});
  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 })
    .limit(limit || pageSize)
    .skip(limit ? 0 : pageSize * (page - 1));

  res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(401);
      throw new Error("Not authorized to view this order");
    }
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid after payment verification
// @route   PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // ... logic remains the same
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to cancel this order");
  }
  if (order.isDelivered) {
    res.status(400);
    throw new Error("Cannot cancel a delivered order.");
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  order.isCancelled = true;
  order.cancelledAt = Date.now();
  order.cancellationReason = reason;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
// @desc    Update an order with tracking information
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const updateOrderTracking = asyncHandler(async (req, res) => {
  const { shippingPartner, trackingId } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.shippingPartner = shippingPartner;
    order.trackingId = trackingId;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  updateOrderTracking,
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
  getOrderSummary,
  getSalesData,
  cancelOrder,
};
