import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Helper to create a user-friendly title from the route path
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "dashboard":
        return "Dashboard";
      case "productlist":
        return "Products";
      case "orderlist":
        return "Orders";
      case "userlist":
        return "Users";
      default:
        return "Admin";
    }
  };

  const activeLink = "bg-brand-accent text-white";
  const normalLink = "text-text-primary hover:bg-page-bg";

  const SidebarContent = () => (
    <nav className="flex flex-col space-y-2">
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `${
            isActive ? activeLink : normalLink
          } p-3 rounded-md flex items-center transition-colors`
        }
      >
        <FaTachometerAlt className="mr-3" /> Dashboard
      </NavLink>
      <NavLink
        to="/admin/productlist"
        className={({ isActive }) =>
          `${
            isActive ? activeLink : normalLink
          } p-3 rounded-md flex items-center transition-colors`
        }
      >
        <FaBoxOpen className="mr-3" /> Products
      </NavLink>
      <NavLink
        to="/admin/orderlist"
        className={({ isActive }) =>
          `${
            isActive ? activeLink : normalLink
          } p-3 rounded-md flex items-center transition-colors`
        }
      >
        <FaShoppingCart className="mr-3" /> Orders
      </NavLink>
      <NavLink
        to="/admin/userlist"
        className={({ isActive }) =>
          `${
            isActive ? activeLink : normalLink
          } p-3 rounded-md flex items-center transition-colors`
        }
      >
        <FaUsers className="mr-3" /> Users
      </NavLink>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-page-bg">
      {/* --- Desktop Sidebar --- */}
      <aside className="w-64 bg-white p-4 shrink-0 hidden lg:block border-r">
        <SidebarContent />
      </aside>

      {/* --- Mobile Sidebar (Overlay) --- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed top-0 left-0 w-64 h-full bg-white p-4 z-50 lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-2xl"
              >
                <FaTimes />
              </button>
              <div className="mt-12">
                <SidebarContent />
              </div>
            </motion.aside>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white shadow-sm p-4 lg:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl mr-4"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
