import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart, // For main heading, empty cart, and cart item icon
  FiTrash2, // For remove item
  FiPlus, // For quantity increase
  FiMinus, // For quantity decrease
  FiTag, // For subtotal icon
  FiArrowRightCircle, // For checkout button
  FiRefreshCw, // For update quantity
  FiShoppingBag, // For go shopping button
} from "react-icons/fi"; // Using Feather Icons for consistency

import { CartContext } from "../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CartContext);
  const { cartItems } = state;

  // Handler to update item quantity
  const updateQuantityHandler = (item, newQty) => {
    const qty = Number(newQty);
    if (qty < 1) {
      // If quantity drops below 1, prompt for removal
      if (window.confirm(`Remove "${item.name}" from your cart?`)) {
        dispatch({ type: "REMOVE_FROM_CART", payload: item });
        toast.info(`"${item.name}" removed from cart.`);
      }
      return;
    }
    if (item.countInStock < qty) {
      toast.error(
        `Sorry, only ${item.countInStock} of "${item.name}" are available in stock.`
      );
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, qty },
    });
  };

  // Handler to remove an item from the cart
  const removeItemHandler = (item) => {
    if (
      window.confirm(
        `Are you sure you want to remove "${item.name}" from your cart?`
      )
    ) {
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: item,
      });
      toast.info(`"${item.name}" removed from cart.`);
    }
  };

  // Handler for proceeding to checkout
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping"); // Redirect to login if not authenticated, otherwise to shipping
  };

  // Calculate totals
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "0.00";

  // Framer Motion variants for page entry
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Framer Motion variants for cart items (staggered entry)
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gray-50 rounded-xl shadow-inner">
        {" "}
        {/* Background color, inner shadow */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center tracking-tight leading-tight flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <FiShoppingCart className="inline-block mr-4 text-brb-primary text-4xl md:text-5xl" />
          Your Shopping Cart
        </motion.h1>
        <AnimatePresence>
          {cartItems.length === 0 ? (
            <motion.div
              key="empty-cart" // Key for AnimatePresence to detect removal
              className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <FiShoppingCart className="mx-auto text-7xl text-gray-400 mb-6" />{" "}
              {/* Larger, softer icon */}
              <p className="text-2xl font-semibold text-gray-700 mb-4">
                Your cart is empty!
              </p>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Explore
                our beautiful collection and find your perfect piece.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center bg-brb-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brb-primary-dark transition-colors shadow-md"
              >
                <FiShoppingBag className="mr-2" /> Go Shopping
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="cart-items" // Key for AnimatePresence to detect addition
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
              initial="hidden"
              animate="visible"
              variants={pageVariants}
            >
              {/* Cart Items List */}
              <motion.div
                className="lg:col-span-2 flex flex-col space-y-4"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.08 }, // Stagger children animation
                  },
                }}
              >
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout // Smooth layout transitions for adding/removing items
                    variants={itemVariants} // Apply item entry/exit animation
                    className="flex flex-col sm:flex-row items-center bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 relative group"
                  >
                    {/* Item Image */}
                    <Link
                      to={`/product/${item._id}`}
                      className="flex-shrink-0 mb-4 sm:mb-0 mr-0 sm:mr-6"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded-lg border border-gray-200"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-grow text-center sm:text-left mx-0 sm:mx-4 mb-4 sm:mb-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="font-bold text-lg text-gray-900 hover:text-brb-primary line-clamp-2 leading-tight"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xl font-extrabold text-brb-primary mt-1">
                        ₹{formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Selector & Remove Button */}
                    <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 ml-auto flex-shrink-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-md w-fit overflow-hidden shadow-sm">
                        <button
                          onClick={() =>
                            updateQuantityHandler(item, item.qty - 1)
                          }
                          disabled={item.qty <= 1}
                          className="px-3 py-2 text-xl text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 py-2 text-lg font-semibold text-gray-800 border-x border-gray-300">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantityHandler(item, item.qty + 1)
                          }
                          disabled={item.qty >= item.countInStock}
                          className="px-3 py-2 text-xl text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <FiPlus />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItemHandler(item)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FiTrash2 className="text-2xl" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Order Summary */}
              <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-28">
                {" "}
                {/* Sticky position */}
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4 text-center">
                  Order Summary
                </h2>
                <div className="flex justify-between items-center text-lg font-semibold text-gray-700 mb-4">
                  <span className="flex items-center">
                    <FiTag className="mr-2 text-brb-primary" /> Items (
                    {totalItems})
                  </span>
                  <span className="text-xl text-gray-900">
                    ₹{formatPrice(itemsPrice)}
                  </span>
                </div>
                <div className="mt-6">
                  <button
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                    className="w-full bg-brb-primary text-white py-3 rounded-lg hover:bg-brb-primary-dark transition-colors font-semibold text-lg flex items-center justify-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <FiArrowRightCircle className="mr-2" /> Proceed to Checkout
                  </button>
                </div>
                <Link
                  to="/shop"
                  className="w-full inline-flex items-center justify-center bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors mt-3"
                >
                  <FiShoppingBag className="mr-2" /> Continue Shopping
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CartPage;
