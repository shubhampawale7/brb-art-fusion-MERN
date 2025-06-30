import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ icon, title, value, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    {icon}
    <div className="ml-4">
      <p className="text-lg text-text-secondary">{title}</p>
      {loading ? (
        <ClipLoader size={20} color="#334155" />
      ) : (
        <p className="text-3xl font-bold text-text-primary">{value}</p>
      )}
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summaryPromise = API.get("/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const salesPromise = API.get("/orders/summary/sales-data", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const recentOrdersPromise = API.get("/orders?limit=5", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const [summaryRes, salesRes, recentOrdersRes] = await Promise.all([
          summaryPromise,
          salesPromise,
          recentOrdersPromise,
        ]);

        setSummary(summaryRes.data);
        setSalesData(salesRes.data);
        setRecentOrders(recentOrdersRes.data.orders);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchDashboardData();
  }, [userInfo]);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (value) => `₹${value}` } },
      x: { grid: { display: false } },
    },
  };

  const chartData = {
    labels:
      salesData?.map((d) =>
        new Date(d._id).toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
        })
      ) || [],
    datasets: [
      {
        label: "Sales",
        data: salesData?.map((d) => d.totalSales) || [],
        backgroundColor: "#991B1B",
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BRB Art Fusion</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back, {userInfo?.name}!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaRupeeSign className="text-4xl text-brand-accent" />}
            title="Total Sales"
            value={summary ? `₹${summary.totalSales.toFixed(2)}` : "0.00"}
            loading={loading}
          />
          <StatCard
            icon={<FaShoppingCart className="text-4xl text-brand-accent" />}
            title="Total Orders"
            value={summary?.numOrders || 0}
            loading={loading}
          />
          <StatCard
            icon={<FaBoxOpen className="text-4xl text-brand-accent" />}
            title="Total Products"
            value={summary?.numProducts || 0}
            loading={loading}
          />
          <StatCard
            icon={<FaUsers className="text-4xl text-brand-accent" />}
            title="Total Customers"
            value={summary?.numUsers || 0}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
            <div className="h-[300px] flex justify-center items-center">
              {loading ? (
                <ClipLoader color="#BFA181" />
              ) : (
                <Bar options={chartOptions} data={chartData} />
              )}
            </div>
          </div>
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-col space-y-3">
              <Link
                to="/admin/productlist"
                className="bg-brand-accent text-white px-5 py-3 rounded-md hover:bg-opacity-90 transition font-semibold text-center"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orderlist"
                className="bg-text-primary text-white px-5 py-3 rounded-md hover:bg-opacity-80 transition font-semibold text-center"
              >
                View All Orders
              </Link>
              <Link
                to="/admin/userlist"
                className="bg-gray-200 text-text-primary px-5 py-3 rounded-md hover:bg-gray-300 transition font-semibold text-center"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <ClipLoader color="#BFA181" />
            </div>
          ) : (
            <div>
              {/* --- MOBILE VIEW: Recent Orders as Cards --- */}
              <div className="space-y-4 md:hidden">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-xs text-text-secondary">
                          {order._id}
                        </p>
                        <p className="font-semibold text-text-primary">
                          {order.user?.name || "N/A"}
                        </p>
                      </div>
                      <p className="font-bold text-lg">
                        ₹{order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center text-sm">
                      <span
                        className={`font-semibold px-2 py-1 rounded-full ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </span>
                      <Link
                        to={`/admin/order/${order._id}`}
                        className="text-brand-accent font-semibold hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* --- DESKTOP VIEW: Recent Orders as Table --- */}
              <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full">
                  <thead className="border-b-2 border-gray-200">
                    <tr /* ... Table Headers ... */></tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-t hover:bg-page-bg">
                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                          {order._id.substring(0, 12)}...
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {order.user?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          ₹{order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {order.isPaid ? (
                            <FaCheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimesCircle className="text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="text-brand-accent font-semibold hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
