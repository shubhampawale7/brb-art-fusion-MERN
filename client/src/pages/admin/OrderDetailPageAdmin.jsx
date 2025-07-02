import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
      toast.success("Tracking information updated!");
      fetchOrder();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update tracking."
      );
    } finally {
      setLoadingTracking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="#BFA181" size={50} />
      </div>
    );
  if (!order)
    return (
      <div className="text-center py-10 font-serif text-2xl">
        Order Not Found.
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Manage Order {order._id}</title>
      </Helmet>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-serif">Manage Order</h1>
        <p className="text-lg text-text-secondary font-mono">ID: {order._id}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Customer & Shipping
              </h2>
              <div className="space-y-1 text-text-secondary">
                <p>
                  <strong>Customer:</strong> {order.user.name}
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
                  <strong>Address:</strong>{" "}
                  {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`}
                </p>
              </div>
            </div>

            {/* --- New Tracking Information Section --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Shipping & Tracking
              </h2>
              <form onSubmit={trackingSubmitHandler} className="space-y-4">
                <div>
                  <label
                    htmlFor="shippingPartner"
                    className="font-semibold text-sm"
                  >
                    Shipping Partner
                  </label>
                  <input
                    id="shippingPartner"
                    type="text"
                    placeholder="e.g., Delhivery, Ekart"
                    value={shippingPartner}
                    onChange={(e) => setShippingPartner(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="trackingId" className="font-semibold text-sm">
                    Tracking ID (AWB No.)
                  </label>
                  <input
                    id="trackingId"
                    type="text"
                    placeholder="Enter tracking number"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingTracking}
                  className="w-full bg-text-primary text-white py-2 rounded-md hover:bg-opacity-90 transition font-semibold flex justify-center"
                >
                  {loadingTracking ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    "Save Tracking Info"
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
              {/* Order Items Table/List */}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4 sticky top-28">
              <h2 className="text-2xl font-semibold text-center border-b pb-4 mb-4">
                Order Status
              </h2>
              <div className="flex justify-between items-center">
                <strong>Total Price:</strong>{" "}
                <span className="font-bold text-lg">
                  ₹{order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <strong>Paid:</strong>{" "}
                {order.isPaid ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
              </div>
              <div className="flex justify-between items-center">
                <strong>Delivered:</strong>{" "}
                {order.isDelivered ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xl font-bold mb-3">Admin Actions</h3>
                <div className="flex flex-col space-y-3">
                  {order.isPaid && !order.isDelivered && (
                    <button
                      type="button"
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
                      onClick={markAsDeliveredHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Mark As Delivered"
                      )}
                    </button>
                  )}
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-2 rounded-md cursor-not-allowed"
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
