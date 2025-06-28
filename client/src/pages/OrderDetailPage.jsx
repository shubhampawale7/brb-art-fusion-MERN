import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const OrderDetailPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const { state: auth } = useContext(AuthContext);
  const { userInfo } = auth;

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrder(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not fetch order details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  const payWithRazorpayHandler = async () => {
    setLoadingPay(true);
    try {
      const { data: razorpayOrder } = await API.post(
        "/orders/create-razorpay-order",
        { amount: order.totalPrice },
        { headers: { Authorization: `Bearer userInfo.token` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "BRB Art Fusion",
        description: `Payment for Order #${order._id}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            setLoadingPay(true);
            await API.put(
              `/orders/${order._id}/pay`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer userInfo.token` } }
            );
            toast.success("Payment successful!");
            fetchOrder();
          } catch (error) {
            toast.error("Payment verification failed.");
          } finally {
            setLoadingPay(false);
          }
        },
        prefill: { name: order.user.name, email: order.user.email },
        theme: { color: "#BFA181" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function (response) {
        toast.error("Payment Failed: " + response.error.description);
        setLoadingPay(false);
      });
    } catch (error) {
      toast.error("Could not initiate payment.");
      setLoadingPay(false);
    }
  };

  const markAsDeliveredHandler = async () => {
    setLoadingDeliver(true);
    try {
      await API.put(
        `/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Order marked as delivered!");
      fetchOrder();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order.");
    } finally {
      setLoadingDeliver(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#BFA181" size={50} />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-10">Order not found.</div>;
  }

  return (
    <>
      <Helmet>
        <title>Order {order._id} - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Order Details</h1>
        <p className="text-lg text-gray-600 mb-8">Order ID: {order._id}</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Shipping Info */}
            <div className="p-6 bg-white shadow-md rounded-md mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Shipping Information
              </h2>
              <p>
                <strong>Name:</strong> {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${order.user.email}`}
                  className="text-blue-600"
                >
                  {order.user.email}
                </a>
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              <div
                className={`mt-4 p-2 rounded-md text-center font-semibold ${
                  order.isDelivered
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.isDelivered
                  ? `Delivered on ${new Date(
                      order.deliveredAt
                    ).toLocaleDateString()}`
                  : "Not Delivered"}
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 bg-white shadow-md rounded-md mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Payment Information
              </h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              <div
                className={`mt-4 p-2 rounded-md text-center font-semibold ${
                  order.isPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.isPaid
                  ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                  : "Not Paid"}
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 bg-white shadow-md rounded-md">
              <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between flex-wrap"
                  >
                    <div className="flex items-center mb-2 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="font-semibold hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div>
                      {item.qty} x ₹{item.price.toFixed(2)} ={" "}
                      <strong>₹{(item.qty * item.price).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="p-6 bg-white shadow-md rounded-md sticky top-24">
              <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t mt-2">
                  <span>Total:</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>

              {!order.isPaid && (
                <div className="mt-6">
                  <button
                    onClick={payWithRazorpayHandler}
                    disabled={loadingPay}
                    className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 flex justify-center items-center"
                  >
                    {loadingPay ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      "Proceed to Pay with Razorpay"
                    )}
                  </button>
                </div>
              )}

              {/* Admin "Mark as Delivered" Button */}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
                      onClick={markAsDeliveredHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Mark As Delivered"
                      )}
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
