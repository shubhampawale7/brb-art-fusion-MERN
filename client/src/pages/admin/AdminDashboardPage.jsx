import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaChartBar } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Import Chart.js components
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
  const [loading, setLoading] = useState(true);
  const [isChartVisible, setIsChartVisible] = useState(false); // State to control chart visibility
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get("/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSummary(data);
      } catch (error) {
        toast.error("Failed to load dashboard summary.");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchSummary();
    }
  }, [userInfo]);

  const viewAnalyticsHandler = async () => {
    // If chart is already visible, just hide it
    if (isChartVisible) {
      setIsChartVisible(false);
      return;
    }

    // If sales data is not yet fetched, fetch it now
    if (!salesData) {
      try {
        const { data } = await API.get("/orders/summary/sales-data", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSalesData(data);
      } catch (error) {
        toast.error("Failed to load sales analytics data.");
        return;
      }
    }
    // Show the chart
    setIsChartVisible(true);
  };

  const chartOptions = {
    /* ... same as before ... */
  };
  const chartData = {
    labels: salesData?.map((d) => new Date(d._id).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Sales (₹)",
        data: salesData?.map((d) => d.totalSales) || [],
        backgroundColor: "#991B1B",
        borderRadius: 4,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BRB Art Fusion</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FaShoppingCart className="text-4xl text-brand-accent" />}
            title="Total Sales"
            value={summary ? `₹${summary.totalSales.toFixed(2)}` : "0.00"}
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

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/productlist"
              className="bg-brand-accent text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition font-semibold"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orderlist"
              className="bg-text-primary text-white px-6 py-3 rounded-md hover:bg-opacity-80 transition font-semibold"
            >
              View Orders
            </Link>
            {/* New Button to toggle chart visibility */}
            <button
              onClick={viewAnalyticsHandler}
              className="bg-gray-200 text-text-primary px-6 py-3 rounded-md hover:bg-gray-300 transition font-semibold flex items-center"
            >
              <FaChartBar className="mr-2" /> {isChartVisible ? "Hide" : "View"}{" "}
              Sales Analytics
            </button>
          </div>
        </div>

        {/* Conditionally Rendered Chart Section with Animation */}
        <AnimatePresence>
          {isChartVisible && (
            <motion.div
              key="sales-chart"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "2rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
                {salesData ? (
                  <Bar options={chartOptions} data={chartData} />
                ) : (
                  <div className="flex justify-center py-10">
                    <ClipLoader color="#BFA181" size={50} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminDashboardPage;
