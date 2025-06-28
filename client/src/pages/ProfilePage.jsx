import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state: auth } = useContext(AuthContext);
  const { userInfo } = auth;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Could not fetch orders."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  return (
    <>
      <Helmet>
        <title>My Profile - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {/* User Details Column */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <div className="space-y-2">
              <div>
                <p className="font-bold">Name:</p>
                <p>{userInfo?.name}</p>
              </div>
              <div>
                <p className="font-bold">Email:</p>
                <p>{userInfo?.email}</p>
              </div>
            </div>
            {/* We can add an 'Update Profile' button here later */}
          </div>

          {/* Order History Column */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <ClipLoader color="#BFA181" size={50} />
              </div>
            ) : orders.length === 0 ? (
              <p>You have not placed any orders yet.</p>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Paid
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Delivered
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          ${order.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {order.isPaid ? (
                            <FaCheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimesCircle className="text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {order.isDelivered ? (
                            <FaCheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimesCircle className="text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <Link
                            to={`/order/${order._id}`}
                            className="text-[#BFA181] hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
