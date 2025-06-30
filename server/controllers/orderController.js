import Order from "../models/orderModel.js";
import User from "../models/userModel.js"; // <-- Was missing
import Product from "../models/productModel.js";
import crypto from "crypto";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
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
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
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
};

// @desc    Update order to paid after payment verification
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        signature: razorpay_signature,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error("Payment verification failed. Invalid signature.");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  // Check if a 'limit' query parameter exists
  const limit = req.query.limit ? Number(req.query.limit) : 0;

  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(limit); // Apply the limit if it exists

  res.status(200).json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
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
};

// @desc    Get dashboard summary
// @route   GET /api/orders/summary
// @access  Private/Admin
const getOrderSummary = async (req, res) => {
  try {
    const ordersSummary = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    const totalOrders = await Order.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    res.status(200).json({
      totalSales: ordersSummary.length > 0 ? ordersSummary[0].totalSales : 0,
      numOrders: totalOrders,
      numUsers: totalUsers,
      numProducts: totalProducts,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Could not fetch summary data");
  }
};
// @desc    Get sales data for charts
// @route   GET /api/orders/summary/sales-data
// @access  Private/Admin
const getSalesData = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      // Stage 1: Filter for only paid orders
      {
        $match: { isPaid: true },
      },
      // Stage 2: Group by date and calculate total sales per day
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      // Stage 3: Sort by date
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json(salesData);
  } catch (error) {
    res.status(500);
    throw new Error("Could not fetch sales data");
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
  getOrderSummary,
  getSalesData,
};
