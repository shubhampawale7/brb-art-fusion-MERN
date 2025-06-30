import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";

// A small helper component to render status badges
const StatusBadge = ({ order }) => {
  if (order.isCancelled) {
    return (
      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
        Cancelled
      </span>
    );
  }
  if (order.isDelivered) {
    return (
      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
        Delivered
      </span>
    );
  }
  return (
    <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
      In Transit
    </span>
  );
};

const ProfilePage = () => {
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
        toast.error("Could not fetch order history.");
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchOrders();
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoadingUpdate(true);
    try {
      const { data } = await API.put(
        "/users/profile",
        { name, email, password: password || undefined },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      authDispatch({ type: "USER_LOGIN", payload: data });
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

  const inputClass =
    "w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition";

  return (
    <>
      <Helmet>
        <title>My Profile - BRB Art Fusion</title>
      </Helmet>
      <div className="bg-page-bg min-h-full">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-4xl font-bold font-serif mb-8 text-text-primary">
            My Profile
          </h1>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Update Profile Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold font-serif mb-4 text-text-primary">
                  Update Details
                </h2>
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="font-semibold text-sm text-text-secondary"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="font-semibold text-sm text-text-secondary"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="font-semibold text-sm text-text-secondary"
                    >
                      New Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep the same"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="font-semibold text-sm text-text-secondary"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="w-full bg-brand-accent text-white py-2 rounded-md hover:bg-opacity-90 transition font-semibold flex justify-center items-center"
                  >
                    {loadingUpdate ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order History Column */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold font-serif mb-4 text-text-primary">
                My Orders
              </h2>
              {loadingOrders ? (
                <div className="flex justify-center py-10">
                  <ClipLoader color="#BFA181" size={50} />
                </div>
              ) : (
                <>
                  {/* --- MOBILE VIEW: Order History as Cards --- */}
                  <div className="space-y-4 md:hidden">
                    {orders.length === 0 ? (
                      <p className="text-center py-10 text-text-secondary">
                        You have no past orders.
                      </p>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order._id}
                          className="bg-white rounded-lg shadow-md p-4 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-text-primary">
                                ORDER ID
                              </p>
                              <p
                                className="text-xs text-text-secondary font-mono"
                                title={order._id}
                              >
                                {order._id.substring(0, 12)}...
                              </p>
                            </div>
                            <StatusBadge order={order} />
                          </div>
                          <div className="border-t pt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Date:</span>{" "}
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total:</span>{" "}
                              <span className="font-bold">
                                ₹{order.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="border-t pt-2 text-right">
                            <Link
                              to={`/order/${order._id}`}
                              className="text-brand-accent hover:underline font-semibold text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* --- DESKTOP VIEW: Order History as Table --- */}
                  <div className="bg-white shadow-md rounded-lg overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-page-bg">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length === 0 ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-10 text-text-secondary"
                            >
                              You have no past orders.
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order._id} className="hover:bg-page-bg">
                              <td
                                className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-mono"
                                title={order._id}
                              >
                                {order._id.substring(0, 10)}...
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-semibold">
                                ₹{order.totalPrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <StatusBadge order={order} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                <Link
                                  to={`/order/${order._id}`}
                                  className="text-brand-accent hover:underline font-semibold"
                                >
                                  Details
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
