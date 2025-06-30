import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import { toast } from "sonner";

const CartDrawer = ({ isOpen, onClose }) => {
  const { state, dispatch } = useContext(CartContext);
  const { cartItems } = state;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const updateQuantityHandler = (item, newQty) => {
    // Prevent quantity from going below 1 or above available stock
    if (newQty < 1 || newQty > item.countInStock) {
      toast.error(`Only ${item.countInStock} items available in stock.`);
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...item, qty: newQty } });
  };

  const removeFromCartHandler = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
    toast.info(`${item.name} removed from cart.`);
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
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col"
          >
            <header className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold font-serif text-text-primary">
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </header>

            {cartItems.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                <p className="text-xl text-text-secondary">
                  Your cart is empty.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-brand-accent text-white px-6 py-2 rounded-md font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* --- List of Cart Items --- */}
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-grow space-y-1">
                        <Link
                          to={`/product/${item._id}`}
                          className="font-semibold hover:underline text-text-primary"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        <p className="text-brand-gold font-semibold">
                          ₹{item.price.toFixed(2)}
                        </p>

                        {/* --- New Quantity Selector --- */}
                        <div className="flex items-center border rounded-md w-fit">
                          <button
                            onClick={() =>
                              updateQuantityHandler(item, item.qty - 1)
                            }
                            disabled={item.qty === 1}
                            className="px-3 py-1 text-lg disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-bold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantityHandler(item, item.qty + 1)
                            }
                            disabled={item.qty >= item.countInStock}
                            className="px-3 py-1 text-lg disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCartHandler(item)}
                        className="text-gray-400 hover:text-red-500 self-start"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {/* --- Updated Footer Buttons --- */}
                <footer className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="space-y-3">
                    <Link
                      to="/shipping"
                      onClick={onClose}
                      className="w-full block text-center bg-brand-accent text-white py-3 rounded-md font-semibold hover:bg-opacity-90"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={onClose}
                      className="w-full block text-center bg-gray-200 text-text-primary py-3 rounded-md font-semibold hover:bg-gray-300"
                    >
                      Continue Shopping
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
