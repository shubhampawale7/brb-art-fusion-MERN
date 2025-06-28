import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import CheckoutSteps from "../components/common/CheckoutSteps";

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

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { address, city, postalCode, country },
    });
    // Navigate to the next step
    navigate("/payment");
  };

  return (
    <>
      <Helmet>
        <title>Shipping Address - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12 max-w-md">
        <CheckoutSteps step1 step2 />
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Shipping Address
          </h1>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ShippingPage;
