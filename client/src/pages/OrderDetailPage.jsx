import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Modal from "../components/common/Modal";
import CancelOrderModal from "../components/orders/CancelOrderModal";

const OrderDetailPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

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
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
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
              { headers: { Authorization: `Bearer ${userInfo.token}` } }
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
        theme: { color: "#991B1B" },
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

  const cancelOrderHandler = async (reason) => {
    if (!reason) {
      toast.error("Please select a reason for cancellation.");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      setLoadingCancel(true);
      try {
        await API.put(
          `/orders/${orderId}/cancel`,
          { reason },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("Order has been successfully cancelled.");
        setIsCancelModalOpen(false);
        fetchOrder();
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to cancel order."
        );
      } finally {
        setLoadingCancel(false);
      }
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
    return (
      <div className="text-center py-10 font-serif text-2xl text-text-primary">
        Order Not Found.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order {order._id} - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold font-serif mb-2 text-text-primary">
              Order Details
            </h1>
            <p className="text-lg text-text-secondary font-mono">
              ID: {order._id}
            </p>
          </div>
          {order.isCancelled && (
            <div className="p-2 px-4 bg-red-600 text-white rounded-md font-bold text-sm">
              CANCELLED
            </div>
          )}
        </div>

        {order.isCancelled && (
          <div className="p-4 mb-6 bg-red-100 text-red-800 rounded-lg shadow-sm">
            <p>
              This order was cancelled on{" "}
              {new Date(order.cancelledAt).toLocaleDateString()}. Reason:{" "}
              <strong>{order.cancellationReason}</strong>
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">
                Shipping Information
              </h2>
              <div className="space-y-1 text-text-secondary">
                <p>
                  <strong>Name:</strong> {order.user.name}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${order.user.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.user.email}
                  </a>
                </p>
                <p>
                  <strong>Address:</strong> {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
              <div
                className={`mt-4 p-2 rounded-md text-center font-semibold ${
                  order.isDelivered
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {order.isDelivered
                  ? `Delivered on ${new Date(
                      order.deliveredAt
                    ).toLocaleDateString()}`
                  : "In Transit"}
              </div>
            </div>

            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">
                Payment Information
              </h2>
              <div className="space-y-1 text-text-secondary">
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
              </div>
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

            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between flex-wrap border-b last:border-b-0 pb-2"
                  >
                    <div className="flex items-center mb-2 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="font-semibold hover:text-brand-accent"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="font-mono text-text-secondary">
                      {item.qty} x ₹{item.price.toFixed(2)} ={" "}
                      <strong>₹{(item.qty * item.price).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="p-6 bg-white shadow-md rounded-lg sticky top-24">
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

              {!order.isPaid && !order.isCancelled && !userInfo.isAdmin && (
                <div className="mt-6">
                  <button
                    onClick={payWithRazorpayHandler}
                    disabled={loadingPay}
                    className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 flex justify-center items-center font-semibold"
                  >
                    {loadingPay ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      "Proceed to Pay"
                    )}
                  </button>
                </div>
              )}

              {!order.isDelivered &&
                !order.isCancelled &&
                !userInfo.isAdmin && (
                  <div className="mt-4 border-t pt-4">
                    <button
                      onClick={() => setIsCancelModalOpen(true)}
                      className="w-full bg-brand-accent text-white py-2 rounded-md hover:bg-opacity-90 font-semibold"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      >
        <CancelOrderModal
          onConfirm={cancelOrderHandler}
          onCancel={() => setIsCancelModalOpen(false)}
          loading={loadingCancel}
        />
      </Modal>
    </>
  );
};

export default OrderDetailPage;
