import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import CheckoutSteps from "../components/common/CheckoutSteps";
import {
  FiMapPin, // For address
  FiMap, // For city
  FiMail, // For postal code (like mail postal)
  FiGlobe, // For country
  FiCheckCircle, // For continue button
  FiShoppingBag, // Main heading icon
} from "react-icons/fi"; // Feather Icons

const ShippingPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CartContext);
  const { shippingAddress } = state;

  // Initialize state from context or with empty strings
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  // Frontend validation and redirection logic (similar to PaymentPage)
  useEffect(() => {
    // This page doesn't directly depend on AuthContext userInfo but is usually after login.
    // If you need to ensure user is logged in here, you'd add AuthContext and redirect.
    // Example:
    // const { state: authState } = useContext(AuthContext);
    // if (!authState.userInfo) {
    //   navigate("/login?redirect=/shipping");
    //   toast.info("Please log in to proceed with shipping.");
    // }
  }, [navigate]); // Add authState.userInfo to deps if implemented

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { address, city, postalCode, country },
    });
    // Navigate to the next step
    navigate("/payment");
  };

  const inputClass =
    "w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"; // Added mb-1 for label spacing

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
        <title>Shipping Address - BRB Art Fusion</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Full page height, consistent padding */}
        <div className="container mx-auto max-w-2xl">
          {" "}
          {/* Centered content, slightly wider max-width */}
          <CheckoutSteps step1 step2 />{" "}
          {/* step1 is implicitly true if user reaches here */}
          <motion.div
            className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100 mt-8" /* Stronger shadow, softer corners, border, more top margin */
            initial="hidden"
            animate="visible"
            variants={pageVariants}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight leading-tight flex items-center justify-center">
              {" "}
              {/* Larger, bolder heading, centered with icon */}
              <FiShoppingBag className="mr-4 text-brb-primary text-4xl" />
              Shipping Address
            </h1>
            <p className="text-center text-gray-600 mb-8 text-lg">
              Please provide your shipping details.
            </p>

            <form onSubmit={submitHandler} className="space-y-6">
              {" "}
              {/* Increased spacing */}
              {/* Address */}
              <div>
                <label htmlFor="address" className={labelClass}>
                  Address
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              {/* City */}
              <div>
                <label htmlFor="city" className={labelClass}>
                  City
                </label>
                <div className="relative">
                  <FiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              {/* Postal Code */}
              <div>
                <label htmlFor="postalCode" className={labelClass}>
                  Postal Code
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              {/* Country */}
              <div>
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              {/* Continue Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-brb-primary text-white py-3.5 rounded-lg hover:bg-brb-primary-dark transition-colors font-semibold text-lg flex items-center justify-center shadow-md"
                >
                  Continue to Payment <FiCheckCircle className="ml-2 text-xl" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ShippingPage;
