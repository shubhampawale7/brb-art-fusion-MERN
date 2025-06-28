import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Contexts
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { cartItems } = cartState;

  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const { userInfo } = authState;

  const logoutHandler = () => {
    authDispatch({ type: "USER_LOGOUT" });
    cartDispatch({ type: "CART_CLEAR" });
    toast.success("You have been logged out successfully.");
    navigate("/login");
  };

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const navLinkClass = ({ isActive }) =>
    `block py-2 px-3 rounded ${
      isActive ? "text-white bg-[#BFA181]" : "text-gray-700"
    } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#BFA181] md:p-0`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#BFA181] font-serif">
          BRB Art Fusion
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-lg">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        {/* Icons and User/Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Link
            to="/favorites"
            aria-label="Favorites"
            className="relative text-gray-600 hover:text-[#BFA181]"
          >
            <FaHeart className="text-2xl" />
          </Link>
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative text-gray-600 hover:text-[#BFA181]"
          >
            <FaShoppingCart className="text-2xl" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>

          {/* User Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            {userInfo ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none text-gray-600 hover:text-[#BFA181]"
              >
                <span className="font-semibold">
                  {userInfo.name.split(" ")[0]}
                </span>
                <FaUser className="text-2xl" />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="text-gray-600 hover:text-[#BFA181]"
              >
                <FaUser className="text-2xl" />
              </Link>
            )}
            <AnimatePresence>
              {dropdownOpen && userInfo && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl text-gray-600"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </NavLink>
              <NavLink
                to="/about"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
              <div className="border-t my-2"></div>
              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    className={`${navLinkClass} text-gray-700`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className={`${navLinkClass} text-gray-700`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logoutHandler();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={navLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
