import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion"; // For animations

import {
  FiMapPin, // For Shipping
  FiTruck, // For Shipping Status
  FiCreditCard, // For Payment Method
  FiShoppingCart, // For Order Items
  FiTag, // For price breakdown
  FiDollarSign, // For price breakdown
  FiCheckCircle, // For place order button
  FiArrowRightCircle, // For checkout button
  FiRefreshCw, // For refresh button (if needed)
  FiPackage, // For page title
  FiBox, // For individual cart item
  FiMail, // For email in shipping
  FiUser, // For name in shipping
} from "react-icons/fi"; // Feather Icons

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CheckoutSteps from "../components/common/CheckoutSteps";
import API from "../services/api";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { state: cart, dispatch: cartDispatch } = useContext(CartContext);
  const { state: auth } = useContext(AuthContext);
  const [loadingPay, setLoadingPay] = useState(false);

  // Frontend validation and redirection logic
  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      // Check if address exists
      navigate("/shipping");
      toast.info("Please enter your shipping address.");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
      toast.info("Please select a payment method.");
    } else if (cart.cartItems.length === 0) {
      navigate("/cart");
      toast.info(
        "Your cart is empty. Please add items before placing an order."
      );
    }
  }, [
    cart.shippingAddress,
    cart.paymentMethod,
    cart.cartItems.length,
    navigate,
  ]);

  // Calculations
  const itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over ₹1000
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Helper to format price safely
  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "0.00";

  const paymentHandler = async () => {
    // Basic validation before payment
    if (!auth.userInfo) {
      toast.error("You must be logged in to place an order.");
      navigate("/login?redirect=/placeorder");
      return;
    }
    if (cart.cartItems.length === 0) {
      toast.error("Your cart is empty. Cannot place an order.");
      navigate("/shop");
      return;
    }
    if (!cart.shippingAddress?.address) {
      toast.error("Shipping address is missing.");
      navigate("/shipping");
      return;
    }
    if (!cart.paymentMethod) {
      toast.error("Payment method is missing.");
      navigate("/payment");
      return;
    }

    setLoadingPay(true);
    try {
      const { data: razorpayOrder } = await API.post(
        "/orders/create-razorpay-order",
        { amount: totalPrice }, // Use calculated totalPrice
        { headers: { Authorization: `Bearer ${auth.userInfo.token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount, // Amount from Razorpay order
        currency: "INR",
        name: "BRB Art Fusion",
        description: "Payment for your order",
        order_id: razorpayOrder.id, // Order ID from Razorpay
        handler: async function (response) {
          try {
            // After successful payment, create the order in your backend
            const { data: finalOrder } = await API.post(
              "/orders",
              {
                orderItems: cart.cartItems.map((item) => ({
                  // Map to save only necessary fields
                  product: item._id,
                  name: item.name,
                  image: item.images[0], // Only store first image
                  price: item.price,
                  qty: item.qty,
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: formatPrice(itemsPrice),
                shippingPrice: formatPrice(shippingPrice),
                taxPrice: formatPrice(taxPrice),
                totalPrice: formatPrice(totalPrice),
                paymentResult: {
                  // Razorpay payment details
                  id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  order_id: response.razorpay_order_id,
                },
              },
              {
                headers: { Authorization: `Bearer ${auth.userInfo.token}` },
              }
            );

            cartDispatch({ type: "CART_CLEAR" }); // Clear cart after successful order
            toast.success("Payment successful & Order placed! Thank you.");
            navigate(`/order/${finalOrder._id}`); // Redirect to order detail page
          } catch (err) {
            toast.error(
              err.response?.data?.message ||
                "Failed to save the order after payment. Please contact support."
            );
          } finally {
            setLoadingPay(false);
          }
        },
        prefill: {
          name: auth.userInfo.name,
          email: auth.userInfo.email,
        },
        theme: { color: "#BFA181" }, // Your brand accent color for Razorpay theme
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      // Handle cases where Razorpay popup is closed without payment
      rzp.on("payment.failed", function (response) {
        toast.error(
          "Payment Failed: " + (response.error.description || "Unknown error.")
        );
        setLoadingPay(false);
      });
      rzp.on("payment.dismissed", function () {
        toast.info("Payment process dismissed.");
        setLoadingPay(false);
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while initiating payment. Please try again."
      );
      setLoadingPay(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Confirm Order - BRB Art Fusion</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Soft background, consistent padding */}
        <div className="container mx-auto max-w-6xl">
          {" "}
          {/* Wider container for details */}
          <CheckoutSteps step1 step2 step3 step4 />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center tracking-tight leading-tight flex items-center justify-center">
            <FiPackage className="mr-4 text-brb-primary text-4xl md:text-5xl" />
            Place Your Order
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Please review your order details before proceeding to payment.
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 items-start">
            {/* Left Column (Shipping, Payment, Order Items) */}
            <div className="md:col-span-2 space-y-8">
              {/* Shipping Information */}
              <motion.div
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                  <FiMapPin className="mr-3 text-brb-primary text-2xl" />
                  Shipping Address
                </h2>
                <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                  <p className="flex items-center">
                    <FiUser className="mr-2 text-gray-500" />
                    <strong>Recipient:</strong> {auth.userInfo?.name || "N/A"}
                  </p>
                  <p className="flex items-center">
                    <FiMail className="mr-2 text-gray-500" />
                    <strong>Email:</strong> {auth.userInfo?.email || "N/A"}
                  </p>
                  <p className="flex items-start">
                    <FiMapPin className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
                    <strong>Address:</strong>{" "}
                    {cart.shippingAddress?.address || "N/A"},{" "}
                    {cart.shippingAddress?.city || "N/A"},{" "}
                    {cart.shippingAddress?.postalCode || "N/A"},{" "}
                    {cart.shippingAddress?.country || "N/A"}
                  </p>
                  <Link
                    to="/shipping"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm mt-3"
                  >
                    Edit Shipping{" "}
                    <FiArrowRightCircle className="ml-1 text-base" />
                  </Link>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                  <FiCreditCard className="mr-3 text-brb-primary text-2xl" />
                  Payment Method
                </h2>
                <p className="text-base text-gray-700 leading-relaxed flex items-center">
                  <strong>Method:</strong>{" "}
                  <span className="ml-1 font-medium">
                    {cart.paymentMethod || "N/A"}
                  </span>
                </p>
                <Link
                  to="/payment"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm mt-3"
                >
                  Edit Payment Method{" "}
                  <FiArrowRightCircle className="ml-1 text-base" />
                </Link>
              </motion.div>

              {/* Order Items */}
              <motion.div
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                  <FiShoppingCart className="mr-3 text-brb-primary text-2xl" />
                  Order Items
                </h2>
                {cart.cartItems.length === 0 ? (
                  <p className="text-center text-gray-600 py-4">
                    No items in your cart.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col sm:flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center mb-3 sm:mb-0 mr-4">
                          <img
                            src={item.images?.[0] || "placeholder_image_url"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md border border-gray-200 mr-4"
                          />
                          <Link
                            to={`/product/${item._id}`}
                            className="font-semibold text-gray-800 hover:text-brb-primary text-base line-clamp-2"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <span className="text-gray-700 font-medium text-base flex-shrink-0">
                          {item.qty} x ₹{formatPrice(item.price)} ={" "}
                          <strong className="text-gray-900">
                            ₹{formatPrice(item.qty * item.price)}
                          </strong>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column (Order Summary & Place Order) */}
            <div className="md:col-span-1">
              <motion.div
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 sticky top-28"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center border-b pb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-lg text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FiShoppingCart className="mr-2 text-brb-primary" />{" "}
                      Items:
                    </span>
                    <span className="font-medium">
                      ₹{formatPrice(itemsPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FiTruck className="mr-2 text-brb-primary" /> Shipping:
                    </span>
                    <span className="font-medium">
                      ₹{formatPrice(shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FiTag className="mr-2 text-brb-primary" /> Tax (18%):
                    </span>
                    <span className="font-medium">
                      ₹{formatPrice(taxPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-xl pt-3 border-t border-gray-200 mt-3">
                    <span className="flex items-center">
                      <FiDollarSign className="mr-2 text-brb-primary" /> Order
                      Total:
                    </span>
                    <span className="text-brb-primary text-2xl">
                      ₹{formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="w-full bg-brb-primary text-white py-3.5 rounded-lg hover:bg-brb-primary-dark transition-colors font-semibold text-lg flex justify-center items-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={cart.cartItems.length === 0 || loadingPay}
                    onClick={paymentHandler}
                  >
                    {loadingPay ? (
                      <ClipLoader size={24} color="white" />
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" /> Pay Now ₹
                        {formatPrice(totalPrice)}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
