import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FiShoppingCart, // For cart header
  FiX, // For close button
  FiTrash2, // For remove item (more modern than FaTrash)
  FiPlus, // For quantity increase
  FiMinus, // For quantity decrease
  FiArrowRightCircle, // For checkout button
  FiShoppingBag, // For continue shopping button (or for empty cart)
  FiTag, // For subtotal icon
} from "react-icons/fi"; // Using Feather Icons for consistency

import { CartContext } from "../../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { state, dispatch } = useContext(CartContext);
  const { cartItems } = state;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const updateQuantityHandler = (item, newQty) => {
    if (newQty < 1) {
      // If quantity drops below 1, confirm removal
      if (window.confirm(`Remove ${item.name} from your cart?`)) {
        dispatch({ type: "REMOVE_FROM_CART", payload: item });
        toast.info(`${item.name} removed from cart.`);
      }
      return;
    }
    if (newQty > item.countInStock) {
      toast.error(
        `Only ${item.countInStock} of ${item.name} available in stock.`
      );
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...item, qty: newQty } });
  };

  const removeFromCartHandler = (item) => {
    if (
      window.confirm(
        `Are you sure you want to remove "${item.name}" from your cart?`
      )
    ) {
      dispatch({ type: "REMOVE_FROM_CART", payload: item });
      toast.info(`${item.name} removed from cart.`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col rounded-l-xl overflow-hidden" // Added rounded-l-xl
          >
            {/* Drawer Header */}
            <header className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FiShoppingCart className="mr-3 text-brb-primary text-3xl" />
                Your Cart ({cartItems.length})
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 transition-colors text-3xl p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Close cart"
              >
                <FiX />
              </button>
            </header>

            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="flex-grow flex flex-col justify-center items-center text-center p-6 bg-gray-50">
                <FiShoppingCart className="text-brb-primary text-6xl mb-6 opacity-70" />
                <p className="text-2xl font-semibold text-gray-700 mb-4">
                  Your cart is empty!
                </p>
                <p className="text-gray-500 mb-6 max-w-xs">
                  Looks like you haven't added anything to your cart yet. Start
                  shopping to find great deals!
                </p>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="inline-flex items-center bg-brb-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brb-primary-dark transition-colors shadow-md"
                >
                  <FiShoppingBag className="mr-2" /> Start Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="flex-grow p-6 overflow-y-auto space-y-6 custom-scrollbar">
                  {" "}
                  {/* Added custom-scrollbar */}
                  {cartItems.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout // Enable smooth layout transitions when items are added/removed
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100"
                    >
                      <Link
                        to={`/product/${item._id}`}
                        onClick={onClose}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md border border-gray-200"
                        />
                      </Link>
                      <div className="flex-grow space-y-1">
                        <Link
                          to={`/product/${item._id}`}
                          className="font-semibold text-gray-800 hover:text-brb-primary line-clamp-2"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        <p className="text-lg font-bold text-brb-primary">
                          ₹{item.price.toFixed(2)}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300 rounded-md w-fit overflow-hidden shadow-sm mt-2">
                          <button
                            onClick={() =>
                              updateQuantityHandler(item, item.qty - 1)
                            }
                            disabled={item.qty <= 1} // Disable if quantity is 1 (will prompt for removal)
                            className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <FiMinus />
                          </button>
                          <span className="px-4 py-1 text-base font-semibold text-gray-800 border-x border-gray-300">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantityHandler(item, item.qty + 1)
                            }
                            disabled={item.qty >= item.countInStock}
                            className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCartHandler(item)}
                        className="text-gray-500 hover:text-red-600 transition-colors self-start p-2 rounded-full hover:bg-red-50"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer (Subtotal & Buttons) */}
                <footer className="p-6 border-t border-gray-200 bg-white sticky bottom-0">
                  <div className="flex justify-between items-center font-bold text-xl mb-4 text-gray-900">
                    <span className="flex items-center text-brb-primary">
                      <FiTag className="mr-2 text-2xl" /> Subtotal:
                    </span>
                    <span className="text-2xl">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="space-y-3">
                    <Link
                      to="/shipping"
                      onClick={onClose}
                      className="w-full inline-flex items-center justify-center bg-brb-primary text-white py-3.5 rounded-lg font-semibold text-lg hover:bg-brb-primary-dark transition-colors shadow-md"
                    >
                      <FiArrowRightCircle className="mr-2" /> Proceed to
                      Checkout
                    </Link>
                    <button
                      onClick={onClose}
                      className="w-full inline-flex items-center justify-center bg-gray-200 text-gray-700 py-3.5 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
                    >
                      <FiShoppingBag className="mr-2" /> Continue Shopping
                    </button>
                  </div>
                </footer>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
