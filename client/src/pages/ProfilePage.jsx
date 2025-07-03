import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiList,
  FiCheckCircle,
  FiXCircle,
  FiTruck, // Icon for In Transit
  FiCalendar, // Icon for Date
  FiTag, // Icon for Total
  FiChevronRight,
  FiSettings, // Icon for View Details link
} from "react-icons/fi"; // Using Feather Icons for consistency

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

const ProfilePage = () => {
  const navigate = useNavigate(); // For redirection if not logged in
  const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
  const { userInfo } = auth;

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Could not fetch order history."
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchOrders();
    } else {
      // Redirect to login if not logged in
      navigate("/login");
      toast.info("Please log in to view your profile.");
    }
  }, [userInfo, navigate]); // Added navigate to dependency array

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoadingUpdate(true);
    try {
      const { data } = await API.put(
        "/users/profile",
        { name, email, password: password || undefined }, // Only send password if provided
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      // Update user info in AuthContext after successful update
      authDispatch({ type: "USER_LOGIN", payload: data }); // Re-login with updated info
      toast.success("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Common input class for consistent styling
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brb-primary focus:border-brb-primary outline-none transition-all duration-200 text-gray-800";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <Helmet>
        <title>My Profile - BRB Art Fusion</title>
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        {" "}
        {/* Lighter background */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 text-center tracking-tight leading-tight">
            <FiUser className="inline-block mr-4 text-brb-primary text-4xl md:text-5xl" />
            My Profile
          </h1>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
            {/* Update Profile Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FiSettings className="mr-3 text-brb-primary text-2xl" />
                  Account Details
                </h2>
                <form onSubmit={submitHandler} className="space-y-5">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={`${inputClass} pl-10`} // Added padding-left for icon
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className={labelClass}>
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="w-full bg-brb-primary text-white py-3 rounded-lg hover:bg-brb-primary-dark transition-all duration-200 font-semibold text-lg flex justify-center items-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loadingUpdate ? (
                      <ClipLoader size={24} color="white" />
                    ) : (
                      <>
                        <FiSave className="mr-2" /> Update Profile
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order History Column */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiList className="mr-3 text-brb-primary text-2xl" />
                Order History
              </h2>
              {loadingOrders ? (
                <div className="flex justify-center py-20">
                  <ClipLoader color="#BFA181" size={70} />
                </div>
              ) : (
                <>
                  {/* --- MOBILE VIEW: Order History as Cards --- */}
                  <div className="space-y-4 md:hidden">
                    {orders.length === 0 ? (
                      <p className="text-center py-10 text-gray-600 text-lg">
                        You haven't placed any orders yet.
                      </p>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order._id}
                          className="bg-white rounded-xl shadow-md p-4 space-y-3 border border-gray-100"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-base text-gray-900">
                                Order ID:
                              </p>
                              <p
                                className="text-sm text-gray-600 font-mono break-all"
                                title={order._id}
                              >
                                {order._id}
                              </p>
                            </div>
                            <StatusBadge order={order} />
                          </div>
                          <div className="border-t border-gray-200 pt-3 space-y-2 text-base text-gray-700">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center">
                                <FiCalendar className="mr-2" /> Date:
                              </span>{" "}
                              <span className="font-medium">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center">
                                <FiTag className="mr-2" /> Total:
                              </span>{" "}
                              <span className="font-bold text-lg text-brb-primary">
                                ₹{order.totalPrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center">
                                <FiCheckCircle className="mr-2" /> Paid:
                              </span>{" "}
                              {order.isPaid ? (
                                <span className="text-green-600">Yes</span>
                              ) : (
                                <span className="text-red-600">No</span>
                              )}
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-3 text-right">
                            <Link
                              to={`/order/${order._id}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-base"
                            >
                              View Details <FiChevronRight className="ml-1" />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* --- DESKTOP VIEW: Order History as Table --- */}
                  <div className="bg-white shadow-md rounded-xl overflow-x-auto hidden md:block border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {orders.length === 0 ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-10 text-gray-600 text-lg"
                            >
                              You haven't placed any orders yet.
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr
                              key={order._id}
                              className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                            >
                              <td
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono"
                                title={order._id}
                              >
                                {order._id.substring(0, 16)}...
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-semibold">
                                ₹{order.totalPrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <StatusBadge order={order} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                <Link
                                  to={`/order/${order._id}`}
                                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 hover:text-blue-700 transition-colors duration-200 font-medium text-sm"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
