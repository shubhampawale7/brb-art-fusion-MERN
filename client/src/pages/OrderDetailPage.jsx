import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  FiCheckCircle,
  FiXCircle,
  FiTruck, // For delivered status/shipping info
  FiCreditCard, // For payment info
  FiShoppingCart, // For order items
  FiMapPin, // For address
  FiUser, // For user info
  FiMail, // For user email
  FiArrowLeft, // Back button
  FiCalendar, // Date
  FiTag, // Price
  FiBox, // Quantity/product link
  FiAlertCircle, // Cancellation info
  FiRefreshCw, // Refresh button
} from "react-icons/fi"; // Using Feather Icons
import Modal from "../components/common/Modal"; // Ensure this Modal component is styled well
import CancelOrderModal from "../components/orders/CancelOrderModal"; // Ensure this component is styled well

// A small helper component to render status badges
const StatusBadge = ({ order }) => {
  if (order.isCancelled) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
        <FiXCircle className="mr-1" /> Cancelled
      </span>
    );
  }
  if (order.isDelivered) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
        <FiCheckCircle className="mr-1" /> Delivered
      </span>
    );
  }
  // This is for orders that are paid but not delivered/cancelled
  if (order.isPaid) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
        <FiTruck className="mr-1" /> Shipped
      </span>
    );
  }
  // Default status for unpaid/pending
  return (
    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
      <FiList className="mr-1" /> Processing
    </span>
  );
};

const OrderDetailPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
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
        error?.response?.data?.message ||
          "Could not fetch order details. Please check your login status."
      );
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchOrder();
    } else {
      navigate("/login");
      toast.info("Please log in to view order details.");
    }
  }, [orderId, userInfo, navigate]);

  const payWithRazorpayHandler = async () => {
    setLoadingPay(true);
    try {
      // Check if order.totalPrice is valid before proceeding
      if (typeof order.totalPrice !== "number" || order.totalPrice <= 0) {
        toast.error("Invalid order total for payment.");
        setLoadingPay(false);
        return;
      }

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
            toast.error("Payment verification failed. Please contact support.");
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
        toast.error(
          "Payment Failed: " + (response.error.description || "Unknown error.")
        );
        setLoadingPay(false);
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not initiate payment. Please try again."
      );
      setLoadingPay(false);
    }
  };

  const cancelOrderHandler = async (reason) => {
    if (!reason) {
      toast.error("Please select a reason for cancellation.");
      return;
    }
    setLoadingCancel(true);
    try {
      await API.put(
        `/orders/${orderId}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Order has been successfully cancelled!");
      setIsCancelModalOpen(false);
      fetchOrder();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel order. Please contact support."
      );
    } finally {
      setLoadingCancel(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <ClipLoader color="#BFA181" size={70} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-gray-700 text-3xl font-semibold bg-gray-50 min-h-screen">
        Order Not Found. Please check the order ID or your login status.
      </div>
    );
  }

  // Helper to safely get price or default to 0.00
  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "0.00";

  return (
    <>
      <Helmet>
        <title>Order {order._id.substring(0, 8)}... - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          to="/profile"
          className="inline-flex items-center text-brb-primary hover:text-brb-primary-dark transition-colors duration-200 mb-6 font-medium"
        >
          <FiArrowLeft className="mr-2" /> Back to My Orders
        </Link>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Order{" "}
            <span className="font-mono text-brb-primary text-2xl md:text-3xl">
              {order._id.substring(0, 10)}...
            </span>{" "}
            Details
          </h1>
          {order.isCancelled && (
            <div className="inline-flex items-center p-3 bg-red-600 text-white rounded-lg font-bold text-base shadow-md">
              <FiAlertCircle className="mr-2 text-xl" /> CANCELLED
            </div>
          )}
        </div>

        {/* Cancellation Message (if cancelled) */}
        {order.isCancelled && (
          <div className="p-4 mb-8 bg-red-50 text-red-700 rounded-lg shadow-sm border border-red-200 flex items-center space-x-3">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            <div>
              <p className="font-semibold">Order Cancelled:</p>
              <p className="text-sm">
                This order was cancelled on{" "}
                <span className="font-medium">
                  {new Date(order.cancelledAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                . Reason:{" "}
                <span className="font-medium">
                  "{order.cancellationReason}"
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 items-start">
          {/* Left Column (Shipping, Payment, Order Items) */}
          <div className="md:col-span-2 space-y-8">
            {/* Shipping Information Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                <FiTruck className="mr-3 text-brb-primary text-2xl" />
                Shipping Information
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="flex items-center">
                  <FiUser className="mr-2 text-gray-500" />
                  <strong>Name:</strong>{" "}
                  <span className="ml-1 font-medium">
                    {order.user?.name || "N/A"}
                  </span>
                </p>
                <p className="flex items-center">
                  <FiMail className="mr-2 text-gray-500" />
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${order.user?.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium ml-1"
                  >
                    {order.user?.email || "N/A"}
                  </a>
                </p>
                <p className="flex items-start">
                  <FiMapPin className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
                  <strong>Address:</strong>{" "}
                  <span className="ml-1">
                    {order.shippingAddress?.address || "N/A"},{" "}
                    {order.shippingAddress?.city || "N/A"},<br />
                    {order.shippingAddress?.postalCode || "N/A"},{" "}
                    {order.shippingAddress?.country || "N/A"}
                  </span>
                </p>
              </div>
              <div
                className={`mt-6 p-3 rounded-lg text-center font-semibold flex items-center justify-center text-base shadow-sm ${
                  order.isDelivered
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {order.isDelivered ? (
                  <>
                    <FiCheckCircle className="mr-2" /> Delivered on{" "}
                    {new Date(order.deliveredAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </>
                ) : (
                  <>
                    <FiTruck className="mr-2" /> Estimated Delivery: In Transit
                  </>
                )}
              </div>
            </div>

            {/* Payment Information Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                <FiCreditCard className="mr-3 text-brb-primary text-2xl" />
                Payment Information
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="flex items-center">
                  <strong>Method:</strong>{" "}
                  <span className="ml-1 font-medium">
                    {order.paymentMethod || "N/A"}
                  </span>
                </p>
              </div>
              <div
                className={`mt-6 p-3 rounded-lg text-center font-semibold flex items-center justify-center text-base shadow-sm ${
                  order.isPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.isPaid ? (
                  <>
                    <FiCheckCircle className="mr-2" /> Paid on{" "}
                    {new Date(order.paidAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </>
                ) : (
                  <>
                    <FiXCircle className="mr-2" /> Not Paid
                  </>
                )}
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                <FiShoppingCart className="mr-3 text-brb-primary text-2xl" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex flex-col sm:flex-row items-center justify-between flex-wrap border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border border-gray-200 mr-4"
                        />
                        <Link
                          to={`/product/${item.product}`}
                          className="font-semibold text-gray-800 hover:text-brb-primary transition-colors text-base line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-gray-700 text-base font-medium flex-shrink-0">
                        <span className="text-brb-primary font-bold mr-1">
                          {item.qty}
                        </span>{" "}
                        x ₹{formatPrice(item.price)} ={" "}
                        <strong className="text-gray-900">
                          ₹{formatPrice(item.qty * item.price)}
                        </strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No items in this order.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Order Summary & Actions) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center border-b pb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-lg text-gray-700">
                <div className="flex justify-between items-center">
                  <span>Items:</span>
                  <span className="font-medium">
                    ₹{formatPrice(order.itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping:</span>
                  <span className="font-medium">
                    ₹{formatPrice(order.shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax:</span>
                  <span className="font-medium">
                    ₹{formatPrice(order.taxPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold text-xl pt-3 border-t border-gray-200 mt-3">
                  <span>Total:</span>
                  <span className="text-brb-primary text-2xl">
                    ₹{formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Payment/Cancellation Buttons */}
              {!order.isPaid && !order.isCancelled && !userInfo.isAdmin && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    onClick={payWithRazorpayHandler}
                    disabled={loadingPay}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 flex justify-center items-center font-semibold text-lg shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loadingPay ? (
                      <ClipLoader size={24} color="white" />
                    ) : (
                      <>
                        <FiCreditCard className="mr-2" /> Proceed to Pay
                      </>
                    )}
                  </button>
                </div>
              )}

              {!order.isDelivered &&
                !order.isCancelled &&
                !userInfo.isAdmin && (
                  <div
                    className={`mt-4 ${
                      order.isPaid ? "pt-4 border-t border-gray-200" : ""
                    }`}
                  >
                    <button
                      onClick={() => setIsCancelModalOpen(true)}
                      className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold text-lg flex justify-center items-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={loadingCancel}
                    >
                      {loadingCancel ? (
                        <ClipLoader size={24} color="white" />
                      ) : (
                        <>
                          <FiXCircle className="mr-2" /> Cancel Order
                        </>
                      )}
                    </button>
                  </div>
                )}

              {/* Optional: Refresh button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={fetchOrder}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold text-lg flex justify-center items-center shadow-sm"
                  disabled={loading}
                >
                  <FiRefreshCw className="mr-2" /> Refresh Order Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      >
        <CancelOrderModal
          onConfirm={cancelOrderHandler}
          onClose={() => setIsCancelModalOpen(false)}
          loading={loadingCancel}
        />
      </Modal>
    </>
  );
};

export default OrderDetailPage;
