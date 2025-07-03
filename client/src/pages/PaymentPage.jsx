import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CartContext } from "../context/CartContext";
import CheckoutSteps from "../components/common/CheckoutSteps";
import { motion } from "framer-motion"; // For animations
import {
  FiCreditCard, // For Razorpay/general card payment
  FiCheckCircle, // For selected state
  FiChevronRight, // For continue button
  FiDollarSign, // Example for Cash on Delivery
  FiShoppingBag, // Main heading icon
} from "react-icons/fi"; // Feather Icons

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CartContext);
  const { shippingAddress, paymentMethod: currentPaymentMethod } = state;

  const [paymentMethod, setPaymentMethod] = useState(
    currentPaymentMethod || ""
  ); // Initialize with empty string if not set

  useEffect(() => {
    // If shipping address is not set, redirect to shipping page
    if (!shippingAddress?.address) {
      // Added optional chaining for safety
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error("Please select a payment method to continue.");
      return;
    }
    dispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentMethod,
    });
    // Navigate to the final "Place Order" screen
    navigate("/placeorder");
  };

  // Framer Motion variants for page entry
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <Helmet>
        <title>Payment Method - BRB Art Fusion</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Full page height, consistent padding */}
        <div className="container mx-auto max-w-2xl">
          {" "}
          {/* Centered content, slightly wider max-width */}
          <CheckoutSteps step1 step2 step3 />
          <motion.div
            className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100 mt-8" // Stronger shadow, softer corners, border, more top margin
            initial="hidden"
            animate="visible"
            variants={pageVariants}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight leading-tight flex items-center justify-center">
              {" "}
              {/* Larger, bolder heading, centered with icon */}
              <FiShoppingBag className="mr-4 text-brb-primary text-4xl" />
              Payment Method
            </h1>
            <p className="text-center text-gray-600 mb-8 text-lg">
              Choose how you'd like to pay for your order.
            </p>

            <form onSubmit={submitHandler}>
              <div className="space-y-4 md:space-y-5">
                {" "}
                {/* Increased spacing */}
                {/* Razorpay Option */}
                <label
                  className={`flex items-center p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm
                    ${
                      paymentMethod === "Razorpay"
                        ? "border-brb-primary bg-brb-primary-light"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                >
                  <input
                    type="radio"
                    id="Razorpay"
                    name="paymentMethod"
                    value="Razorpay"
                    className="h-5 w-5 text-brb-primary focus:ring-brb-primary border-gray-300 mr-4" // Styled radio button, increased margin
                    checked={paymentMethod === "Razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required // Make selection required
                  />
                  <FiCreditCard className="text-3xl text-gray-700 mr-4" />{" "}
                  {/* Icon for Razorpay */}
                  <span className="text-lg font-semibold text-gray-800 flex-grow">
                    Pay with Razorpay (Online Payment)
                  </span>
                  {paymentMethod === "Razorpay" && (
                    <FiCheckCircle className="text-brb-primary text-2xl ml-auto" />
                  )}{" "}
                  {/* Checkmark icon */}
                </label>
                {/* Example: Cash on Delivery Option (Optional, uncomment if you have this) */}
                {/*
                <label
                  className={`flex items-center p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm
                    ${paymentMethod === "CashOnDelivery" ? "border-brb-primary bg-brb-primary-light" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
                >
                  <input
                    type="radio"
                    id="CashOnDelivery"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    className="h-5 w-5 text-brb-primary focus:ring-brb-primary border-gray-300 mr-4"
                    checked={paymentMethod === "CashOnDelivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  />
                  <FiDollarSign className="text-3xl text-gray-700 mr-4" />
                  <span className="text-lg font-semibold text-gray-800 flex-grow">Cash on Delivery (COD)</span>
                  {paymentMethod === "CashOnDelivery" && <FiCheckCircle className="text-brb-primary text-2xl ml-auto" />}
                </label>
                */}
              </div>
              <div className="pt-8">
                {" "}
                {/* Increased padding top */}
                <button
                  type="submit"
                  className="w-full bg-brb-primary text-white py-3.5 rounded-lg hover:bg-brb-primary-dark transition-colors font-semibold text-lg flex items-center justify-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue <FiChevronRight className="ml-2 text-xl" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
