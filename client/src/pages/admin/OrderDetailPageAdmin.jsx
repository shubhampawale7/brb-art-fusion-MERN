import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaShippingFast,
  FaDollarSign,
  FaBoxOpen,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa"; // Added more relevant icons

const OrderDetailPageAdmin = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [loadingTracking, setLoadingTracking] = useState(false);

  // --- State for the new tracking form ---
  const [shippingPartner, setShippingPartner] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrder(data);
      // Pre-fill form with existing tracking info if it exists
      setShippingPartner(data.shippingPartner || "");
      setTrackingId(data.trackingId || "");
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

  const markAsDeliveredHandler = async () => {
    // Confirmation dialog for better UX
    if (
      !window.confirm("Are you sure you want to mark this order as delivered?")
    ) {
      return;
    }

    setLoadingDeliver(true);
    try {
      await API.put(
        `/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Order marked as delivered successfully!");
      fetchOrder(); // Re-fetch to update status
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update order status."
      );
    } finally {
      setLoadingDeliver(false);
    }
  };

  // --- New handler to submit tracking info ---
  const trackingSubmitHandler = async (e) => {
    e.preventDefault();
    setLoadingTracking(true);
    try {
      await API.put(
        `/orders/${orderId}/tracking`,
        { shippingPartner, trackingId },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Tracking information updated successfully!");
      fetchOrder(); // Re-fetch to display updated tracking info
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update tracking information."
      );
    } finally {
      setLoadingTracking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <ClipLoader color="#BFA181" size={70} />
      </div>
    );
  if (!order)
    return (
      <div className="text-center py-16 text-gray-700 text-3xl font-semibold bg-gray-50 min-h-screen">
        Order not found. Please check the ID.
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Manage Order {order._id} - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          to="/admin/orders"
          className="inline-flex items-center text-brb-primary hover:text-brb-primary-dark transition-colors duration-200 mb-6 font-medium"
        >
          &larr; Back to Order List
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          Order Details
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Order ID: <span className="font-mono text-gray-800">{order._id}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content Area (Customer, Shipping, Order Items) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer & Shipping Information */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                <FaUserCircle className="text-brb-primary mr-3 text-2xl" />
                Customer & Shipping
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <strong>Customer Name:</strong>{" "}
                  <span className="font-semibold">{order.user.name}</span>
                </p>
                <p>
                  <strong>Customer Email:</strong>{" "}
                  <a
                    href={`mailto:${order.user.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                  >
                    {order.user.email}
                  </a>
                </p>
                <p className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                  <strong>Shipping Address:</strong>{" "}
                  <span className="ml-1">
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </span>
                </p>
              </div>
            </div>

            {/* Shipping & Tracking Information */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                <FaShippingFast className="text-brb-primary mr-3 text-2xl" />
                Update Shipping & Tracking
              </h2>
              <form onSubmit={trackingSubmitHandler} className="space-y-5">
                <div>
                  <label
                    htmlFor="shippingPartner"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Shipping Partner
                  </label>
                  <input
                    id="shippingPartner"
                    type="text"
                    placeholder="e.g., Delhivery, Blue Dart"
                    value={shippingPartner}
                    onChange={(e) => setShippingPartner(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brb-primary focus:border-brb-primary outline-none transition-all duration-200 text-gray-800"
                    required // Make it a required field
                  />
                </div>
                <div>
                  <label
                    htmlFor="trackingId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tracking ID (AWB No.)
                  </label>
                  <input
                    id="trackingId"
                    type="text"
                    placeholder="Enter tracking number (e.g., BRB123456789)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brb-primary focus:border-brb-primary outline-none transition-all duration-200 text-gray-800"
                    required // Make it a required field
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingTracking || !shippingPartner || !trackingId}
                  className="w-full bg-brb-primary text-white py-3 rounded-lg hover:bg-brb-primary-dark transition-all duration-200 font-semibold text-lg flex justify-center items-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loadingTracking ? (
                    <ClipLoader size={24} color="white" />
                  ) : (
                    "Save Tracking Information"
                  )}
                </button>
              </form>
            </div>

            {/* Order Items Section */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                <FaBoxOpen className="text-brb-primary mr-3 text-2xl" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No items in this order.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {order.orderItems.map((item) => (
                      <li
                        key={item.product}
                        className="py-4 flex flex-col sm:flex-row items-center justify-between"
                      >
                        <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md border border-gray-200 mr-4"
                          />
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.product}`}
                              className="text-lg font-semibold text-gray-800 hover:text-brb-primary transition-colors duration-200"
                            >
                              {item.name}
                            </Link>
                            <p className="text-gray-500 text-sm">
                              Quantity: {item.qty}
                            </p>
                          </div>
                        </div>
                        <div className="text-right sm:text-base font-semibold text-gray-900 w-full sm:w-auto">
                          ₹{(item.qty * item.price).toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Order Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-800 text-center border-b pb-5 mb-5">
                Order Summary & Actions
              </h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between items-center text-lg">
                  <strong className="font-semibold">Items Price:</strong>{" "}
                  <span className="font-bold text-gray-900">
                    ₹{order.itemsPrice?.toFixed(2) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <strong className="font-semibold">Shipping Price:</strong>{" "}
                  <span className="font-bold text-gray-900">
                    ₹{order.shippingPrice?.toFixed(2) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <strong className="font-semibold">Tax Price:</strong>{" "}
                  <span className="font-bold text-gray-900">
                    ₹{order.taxPrice?.toFixed(2) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-gray-200">
                  <strong>Order Total:</strong>{" "}
                  <span className="text-brb-primary text-2xl">
                    ₹{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Payment & Delivery Status
                </h3>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <strong className="text-gray-700 flex items-center">
                    <FaCreditCard className="mr-2 text-xl" /> Payment Status:
                  </strong>{" "}
                  {order.isPaid ? (
                    <span className="text-green-600 font-semibold flex items-center">
                      <FaCheckCircle className="mr-2 text-lg" /> Paid on{" "}
                      {new Date(order.paidAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold flex items-center">
                      <FaTimesCircle className="mr-2 text-lg" /> Not Paid
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <strong className="text-gray-700 flex items-center">
                    <FaShippingFast className="mr-2 text-xl" /> Delivery Status:
                  </strong>{" "}
                  {order.isDelivered ? (
                    <span className="text-green-600 font-semibold flex items-center">
                      <FaCheckCircle className="mr-2 text-lg" /> Delivered on{" "}
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold flex items-center">
                      <FaTimesCircle className="mr-2 text-lg" /> Not Delivered
                    </span>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Admin Actions
                </h3>
                <div className="flex flex-col space-y-3">
                  {order.isPaid && !order.isDelivered && (
                    <button
                      type="button"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg flex justify-center items-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={markAsDeliveredHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? (
                        <ClipLoader size={24} color="white" />
                      ) : (
                        "Mark As Delivered"
                      )}
                    </button>
                  )}
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed font-semibold text-lg flex justify-center items-center shadow-md"
                  >
                    Issue Refund (Future)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPageAdmin;
