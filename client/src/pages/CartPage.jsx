import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CartContext);
  const { cartItems } = state;

  // Handler to update item quantity
  const updateQuantityHandler = (item, newQty) => {
    const qty = Number(newQty);
    if (item.countInStock < qty) {
      toast.error("Sorry, product is out of stock");
      return;
    }
    dispatch({
      type: "ADD_TO_CART", // We reuse ADD_TO_CART which also handles updates
      payload: { ...item, qty },
    });
  };

  // Handler to remove an item from the cart
  const removeItemHandler = (item) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: item,
    });
    toast.error(`${item.name} removed from cart`);
  };

  // Handler for proceeding to checkout
  const checkoutHandler = () => {
    // We will navigate to a login page if not authenticated, otherwise to shipping
    navigate("/login?redirect=/shipping");
  };

  // Calculate totals
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <Helmet>
        <title>Shopping Cart - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Shopping Cart
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-4 inline-block bg-[#BFA181] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Go Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-grow mx-4">
                    <Link
                      to={`/product/${item._id}`}
                      className="font-semibold hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Quantity Selector */}
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        updateQuantityHandler(item, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItemHandler(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-2xl font-semibold border-b pb-4">
                Order Summary
              </h2>
              <div className="flex justify-between items-center mt-4 text-lg">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="mt-6">
                <button
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition disabled:bg-gray-400"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
