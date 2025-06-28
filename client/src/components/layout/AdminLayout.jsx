import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

const AdminLayout = () => {
  const activeLink = "bg-[#BFA181] text-white";
  const normalLink = "hover:bg-gray-200";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 shrink-0">
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${
                isActive ? activeLink : normalLink
              } p-3 rounded-md flex items-center`
            }
          >
            <FaTachometerAlt className="mr-3" /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/productlist"
            className={({ isActive }) =>
              `${
                isActive ? activeLink : normalLink
              } p-3 rounded-md flex items-center`
            }
          >
            <FaBoxOpen className="mr-3" /> Products
          </NavLink>
          <NavLink
            to="/admin/orderlist"
            className={({ isActive }) =>
              `${
                isActive ? activeLink : normalLink
              } p-3 rounded-md flex items-center`
            }
          >
            <FaShoppingCart className="mr-3" /> Orders
          </NavLink>
          <NavLink
            to="/admin/userlist"
            className={({ isActive }) =>
              `${
                isActive ? activeLink : normalLink
              } p-3 rounded-md flex items-center`
            }
          >
            <FaUsers className="mr-3" /> Users
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
