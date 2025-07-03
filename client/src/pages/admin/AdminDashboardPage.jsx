import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaClipboardList, // New icon for recent orders heading
  FaTachometerAlt,
  FaPlus, // New icon for dashboard title
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Reusable StatCard Component (Enhanced) ---
const StatCard = ({ icon, title, value, loading, detailLink = null }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center justify-center h-full transition-transform duration-200 hover:scale-[1.02]">
    <div className="text-brb-primary text-5xl mb-3">{icon}</div>{" "}
    {/* Increased icon size */}
    <p className="text-lg font-medium text-gray-600 mb-2">{title}</p>
    {loading ? (
      <ClipLoader size={25} color="#BFA181" />
    ) : (
      <p className="text-4xl font-extrabold text-gray-900 leading-none">
        {value}
      </p>
    )}
    {detailLink && !loading && (
      <Link
        to={detailLink}
        className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200 flex items-center"
      >
        View All <FaChevronRight className="ml-1 text-xs" />
      </Link>
    )}
  </div>
);

// New icon for StatCard detail link
const FaChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3 w-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const AdminDashboardPage = () => {
  const navigate = useNavigate(); // For potential redirection
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Ensure user is admin before fetching sensitive data
      if (!userInfo || !userInfo.isAdmin) {
        toast.error("You are not authorized to view this page.");
        navigate("/"); // Redirect to home or login
        return;
      }

      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const [summaryRes, salesRes, recentOrdersRes] = await Promise.all([
          API.get("/orders/summary", config),
          API.get("/orders/summary/sales-data", config),
          API.get("/orders?limit=5", config), // Fetching only 5 recent orders
        ]);

        setSummary(summaryRes.data);
        setSalesData(salesRes.data);
        setRecentOrders(recentOrdersRes.data.orders);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load dashboard data. Please try again."
        );
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          navigate("/login"); // Redirect to login if token invalid or unauthorized
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userInfo, navigate]); // Add navigate to dependency array

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container height
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Daily Sales Overview",
        font: { size: 18, weight: "bold" },
        color: "#334155",
      }, // Added chart title
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toFixed(2)}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
          font: { size: 12 },
          color: "#4A5568",
        },
        grid: {
          color: "#E2E8F0", // Lighter grid lines
        },
        title: {
          display: true,
          text: "Revenue (₹)",
          font: { size: 14, weight: "bold" },
          color: "#334155",
        },
      },
      x: {
        ticks: {
          font: { size: 12 },
          color: "#4A5568",
        },
        grid: { display: false },
        title: {
          display: true,
          text: "Date",
          font: { size: 14, weight: "bold" },
          color: "#334155",
        },
      },
    },
  };

  const chartData = {
    labels:
      salesData?.map((d) =>
        new Date(d._id).toLocaleDateString("en-US", {
          // Changed to en-US for standard short date format
          month: "short",
          day: "numeric",
        })
      ) || [],
    datasets: [
      {
        label: "Sales",
        data: salesData?.map((d) => d.totalSales) || [],
        backgroundColor: "#BFA181", // Your brand primary color
        borderColor: "#BFA181",
        borderWidth: 1,
        hoverBackgroundColor: "#A08060", // Darker shade on hover
        borderRadius: 6, // Slightly more rounded bars
        barThickness: "flex", // Allow bars to flex based on available space
        maxBarThickness: 40, // Max width for individual bars
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight flex items-center justify-center">
            <FaTachometerAlt className="mr-4 text-brb-primary text-4xl md:text-5xl" />
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Welcome back,{" "}
            <span className="font-semibold text-gray-800">
              {userInfo?.name || "Administrator"}
            </span>
            ! Here's a quick overview of your store.
          </p>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<FaRupeeSign />}
            title="Total Sales"
            value={
              summary
                ? `₹${summary.totalSales.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}`
                : "₹0.00"
            }
            loading={loading}
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Total Orders"
            value={summary?.numOrders?.toLocaleString() || "0"}
            loading={loading}
            detailLink="/admin/orderlist" // Link to all orders
          />
          <StatCard
            icon={<FaBoxOpen />}
            title="Total Products"
            value={summary?.numProducts?.toLocaleString() || "0"}
            loading={loading}
            detailLink="/admin/productlist" // Link to all products
          />
          <StatCard
            icon={<FaUsers />}
            title="Total Customers"
            value={summary?.numUsers?.toLocaleString() || "0"}
            loading={loading}
            detailLink="/admin/userlist" // Link to all users
          />
        </div>

        {/* Sales Analytics & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Sales Analytics Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaChartBar className="mr-3 text-brb-primary text-2xl" /> Daily
              Sales Trend
            </h2>
            <div className="flex-grow min-h-[300px] flex items-center justify-center">
              {" "}
              {/* Added min-h and flex properties */}
              {loading ? (
                <ClipLoader color="#BFA181" size={50} />
              ) : salesData && salesData.length > 0 ? (
                <Bar options={chartOptions} data={chartData} />
              ) : (
                <p className="text-gray-600 text-lg">
                  No sales data available for display.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center border-b pb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col space-y-4 flex-grow">
              <Link
                to="/admin/productlist"
                className="w-full bg-brb-primary text-white py-3 rounded-lg hover:bg-brb-primary-dark transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-md"
              >
                <FaBoxOpen className="mr-2" /> Manage Products
              </Link>
              <Link
                to="/admin/orderlist"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-md"
              >
                <FaShoppingCart className="mr-2" /> View All Orders
              </Link>
              <Link
                to="/admin/userlist"
                className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-md"
              >
                <FaUsers className="mr-2" /> Manage Users
              </Link>
              <Link
                to="/admin/product/create" // Assuming a route for direct product creation
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-md"
              >
                <FaPlus className="mr-2" /> Add New Product
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
            <FaClipboardList className="mr-3 text-brb-primary text-2xl" />{" "}
            Recent Orders
          </h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <ClipLoader color="#BFA181" size={50} />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-600 text-lg text-center py-5">
              No recent orders to display.
            </p>
          ) : (
            <div>
              {/* --- MOBILE VIEW: Recent Orders as Cards --- */}
              <div className="space-y-4 md:hidden">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-xs text-gray-500 mb-1">
                          Order ID: {order._id.substring(0, 12)}...
                        </p>
                        <p className="font-semibold text-gray-900 text-base">
                          Customer: {order.user?.name || "Guest User"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Date:{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                      <p className="font-bold text-xl text-brb-primary">
                        ₹
                        {order.totalPrice.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm">
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-white ${
                          order.isPaid ? "bg-green-600" : "bg-red-500"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </span>
                      <Link
                        to={`/admin/order/${order._id}`}
                        className="text-blue-600 font-semibold hover:underline flex items-center"
                      >
                        View Details <FaChevronRight className="ml-1 text-xs" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* --- DESKTOP VIEW: Recent Orders as Table --- */}
              <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Paid
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                          {order._id.substring(0, 16)}...
                        </td>
                        <td className="px-4 py-3 text-base font-medium text-gray-900">
                          {order.user?.name || "Guest User"}
                        </td>
                        <td className="px-4 py-3 text-base text-gray-700">
                          ₹
                          {order.totalPrice.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {order.isPaid ? (
                            <FaCheckCircle
                              className="text-green-500 text-lg mx-auto"
                              title="Paid"
                            />
                          ) : (
                            <FaTimesCircle
                              className="text-red-400 text-lg mx-auto"
                              title="Not Paid"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {order.isDelivered ? (
                            <FaCheckCircle
                              className="text-green-500 text-lg mx-auto"
                              title="Delivered"
                            />
                          ) : (
                            <FaTimesCircle
                              className="text-red-400 text-lg mx-auto"
                              title="Not Delivered"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 hover:text-blue-700 transition-colors duration-200 font-medium text-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentOrders.length === 0 && !loading && (
                  <p className="text-gray-600 text-lg text-center py-5">
                    No recent orders to display.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
