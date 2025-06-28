import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaShoppingCart } from "react-icons/fa";

const AdminDashboardPage = () => {
  // We will fetch these numbers from the backend later
  const stats = {
    products: 58,
    users: 12,
    orders: 150,
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
          <div className="bg-gray-50 p-6 rounded-lg shadow-md flex items-center">
            <FaBoxOpen className="text-4xl text-[#BFA181] mr-4" />
            <div>
              <p className="text-lg text-gray-600">Total Products</p>
              <p className="text-3xl font-bold">{stats.products}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md flex items-center">
            <FaUsers className="text-4xl text-[#BFA181] mr-4" />
            <div>
              <p className="text-lg text-gray-600">Total Users</p>
              <p className="text-3xl font-bold">{stats.users}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md flex items-center">
            <FaShoppingCart className="text-4xl text-[#BFA181] mr-4" />
            <div>
              <p className="text-lg text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold">{stats.orders}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <Link
              to="/admin/productlist"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Manage Products
            </Link>
            {/* <Link to="/admin/orderlist" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition">
              View Orders
            </Link> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
