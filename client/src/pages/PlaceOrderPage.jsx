import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CheckoutSteps from "../components/common/CheckoutSteps";
import API from "../services/api";
import { ClipLoader } from "react-spinners";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { state: cart, dispatch: cartDispatch } = useContext(CartContext);
  const { state: auth } = useContext(AuthContext);
  const [loadingPay, setLoadingPay] = useState(false);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress, navigate]);

  // Calculations
  const itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const paymentHandler = async () => {
    setLoadingPay(true);
    try {
      const { data: razorpayOrder } = await API.post(
        "/orders/create-razorpay-order",
        { amount: totalPrice },
        { headers: { Authorization: `Bearer ${auth.userInfo.token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "BRB Art Fusion",
        description: "Payment for your order",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const { data: finalOrder } = await API.post(
              "/orders",
              {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: itemsPrice.toFixed(2),
                shippingPrice: shippingPrice.toFixed(2),
                taxPrice: taxPrice.toFixed(2),
                totalPrice: totalPrice.toFixed(2),
                paymentResult: {
                  id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  order_id: response.razorpay_order_id,
                },
              },
              {
                headers: { Authorization: `Bearer ${auth.userInfo.token}` },
              }
            );

            cartDispatch({ type: "CART_CLEAR" });
            toast.success("Payment successful & Order placed!");
            navigate(`/order/${finalOrder._id}`);
          } catch (err) {
            toast.error("Failed to save the order after payment.");
          }
        },
        prefill: {
          name: auth.userInfo.name,
          email: auth.userInfo.email,
        },
        theme: { color: "#BFA181" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function (response) {
        toast.error("Payment Failed: " + response.error.description);
        setLoadingPay(false);
      });
    } catch (error) {
      // === THIS IS THE CORRECTED PART ===
      // Instead of a generic message, we now show the actual error from the backend.
      toast.error(
        error?.response?.data?.message ||
          "An unknown error occurred while initiating payment."
      );
      setLoadingPay(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Confirm Order - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <CheckoutSteps step1 step2 step3 step4 />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Shipping, Payment, and Order Items display */}
            <div className="p-4 bg-white shadow-md rounded-md mb-4">
              <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-md mb-4">
              <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
              <p>
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-md">
              <h2 className="text-2xl font-semibold mb-2">Order Items</h2>
              {cart.cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>
                    {item.qty} x ₹{item.price.toFixed(2)} = ₹
                    {(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="p-6 bg-white shadow-md rounded-md">
              <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span>₹{taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t mt-2">
                  <span>Total:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition mt-6 text-lg flex justify-center items-center"
                disabled={cart.cartItems.length === 0 || loadingPay}
                onClick={paymentHandler}
              >
                {loadingPay ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  `Proceed to Pay ₹${totalPrice.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
