import { useState, useRef, useEffect } from "react"; // Added useRef and useEffect for outside click
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaBars,
  FaTimes,
  FaArrowLeft, // Added for mobile header icon
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async"; // Good practice for SEO/browser tab titles

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null); // Ref for sidebar for outside click detection

  // Helper to create a user-friendly title from the route path
  const getPageTitle = () => {
    const path = location.pathname.split("/").filter(Boolean).pop(); // Filter(Boolean) to handle trailing slashes
    switch (path) {
      case "dashboard":
        return "Dashboard Overview";
      case "productlist":
      case "product": // Handle /admin/product/:id/edit routes
        return "Product Management";
      case "orderlist":
      case "order": // Handle /admin/order/:id routes
        return "Order Management";
      case "userlist":
        return "User Management";
      default:
        return "Admin Panel";
    }
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Handle clicks outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const activeLinkClass = "bg-brb-primary text-white"; // Using your brand primary
  const normalLinkClass = "text-gray-700 hover:bg-gray-100 hover:text-gray-900"; // More nuanced hover

  const SidebarContent = () => (
    <nav className="flex flex-col space-y-2 pt-4">
      {" "}
      {/* Added padding top for aesthetic */}
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `p-3 rounded-lg flex items-center transition-all duration-200 ${
            isActive ? activeLinkClass : normalLinkClass
          }`
        }
        end // Ensures exact match for dashboard
      >
        <FaTachometerAlt className="mr-3 text-lg" /> Dashboard
      </NavLink>
      <NavLink
        to="/admin/productlist"
        className={({ isActive }) =>
          `p-3 rounded-lg flex items-center transition-all duration-200 ${
            isActive ? activeLinkClass : normalLinkClass
          }`
        }
      >
        <FaBoxOpen className="mr-3 text-lg" /> Products
      </NavLink>
      <NavLink
        to="/admin/orderlist"
        className={({ isActive }) =>
          `p-3 rounded-lg flex items-center transition-all duration-200 ${
            isActive ? activeLinkClass : normalLinkClass
          }`
        }
      >
        <FaShoppingCart className="mr-3 text-lg" /> Orders
      </NavLink>
      <NavLink
        to="/admin/userlist"
        className={({ isActive }) =>
          `p-3 rounded-lg flex items-center transition-all duration-200 ${
            isActive ? activeLinkClass : normalLinkClass
          }`
        }
      >
        <FaUsers className="mr-3 text-lg" /> Users
      </NavLink>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      {" "}
      {/* Updated background and default font/text color */}
      <Helmet>
        <title>{getPageTitle()} - Admin Panel</title>
      </Helmet>
      {/* --- Desktop Sidebar --- */}
      <aside className="w-64 bg-white p-6 shrink-0 hidden lg:block border-r border-gray-200 shadow-lg">
        {" "}
        {/* Increased padding, added shadow and border */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">BRB Admin</h2>{" "}
          {/* Logo/Brand name */}
        </div>
        <SidebarContent />
      </aside>
      {/* --- Mobile Sidebar (Overlay) --- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.aside
              ref={sidebarRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed top-0 left-0 w-64 h-full bg-white p-6 z-50 lg:hidden shadow-xl border-r border-gray-200"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors text-2xl focus:outline-none"
                aria-label="Close sidebar"
              >
                <FaTimes />
              </button>
              <div className="mt-12 text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">BRB Admin</h2>
              </div>
              <SidebarContent />
            </motion.aside>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>
          </>
        )}
      </AnimatePresence>
      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header for Mobile/Tablet */}
        <header className="bg-white shadow-md p-4 lg:hidden sticky top-0 z-30 border-b border-gray-200">
          {" "}
          {/* Added sticky, shadow-md */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 transition-colors text-2xl focus:outline-none"
              aria-label="Open sidebar"
            >
              <FaBars />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 ml-4 flex-grow text-center">
              {getPageTitle()}
            </h1>
            {/* Optional: Add a user dropdown or notifications here */}
            <div className="w-8 h-8 opacity-0"></div>{" "}
            {/* Spacer for symmetry */}
          </div>
        </header>

        {/* Desktop Header for Main Content Area */}
        <header className="bg-white shadow-md p-6 hidden lg:block sticky top-0 z-30 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {getPageTitle()}
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {" "}
          {/* Adjusted padding */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
