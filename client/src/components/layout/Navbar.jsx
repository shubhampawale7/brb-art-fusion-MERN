import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiChevronDown,
  FiTag, // Still useful for categories
  // FiStar, // REMOVED: No longer needed as featured products are gone
  FiHome,
  FiPhone,
  FiLayers,
  FiLogOut,
  FiSettings,
  FiList,
  FiGlobe,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Contexts & API
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { WishlistContext } from "../../context/WishlistContext";
import API from "../../services/api";
import Logo from "../common/Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [navCategories, setNavCategories] = useState([]);
  // const [featuredItems, setFeaturedItems] = useState([]); // REMOVED: No longer needed

  const announcements = [
    "✨ Free Shipping on All Orders Above ₹2000! ✨",
    "🎉 New Arrivals are Here! Shop Now! 🎉",
    "Handcrafted with ❤️ from India",
    "🎁 The Perfect Gift for Any Occasion! 🎁",
  ];
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { cartItems } = cartState;
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const { userInfo } = authState;
  const { state: wishlistState, dispatch: wishlistDispatch } =
    useContext(WishlistContext);
  const { wishlistItems } = wishlistState;

  // Only fetch categories for the mega menu
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const categoriesRes = await API.get("/products/categories");
        setNavCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      }
    };
    fetchMenuData();
  }, []);

  const logoutHandler = () => {
    authDispatch({ type: "USER_LOGOUT" });
    cartDispatch({ type: "CART_CLEAR" });
    wishlistDispatch({ type: "CLEAR_WISHLIST" });
    toast.success("You have been logged out successfully!");
    navigate("/login");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setMegaMenuOpen(false);
      }
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, megaMenuOpen, mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const desktopNavLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-base transition-colors duration-300 relative group
    ${
      isActive
        ? "text-brb-primary"
        : "text-gray-700 hover:text-brb-primary-dark"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center w-full px-4 py-2.5 text-lg rounded-lg transition-colors duration-200
    ${
      isActive ? "bg-brb-primary text-white" : "text-gray-800 hover:bg-gray-100"
    }`;

  const megaMenuLinkClass =
    "block p-2 text-gray-700 hover:bg-gray-100 hover:text-brb-primary rounded-md transition-colors text-sm font-medium";

  const hamburgerVariants = {
    open: { rotate: 90 },
    closed: { rotate: 0 },
  };

  const lineVariants = {
    open: {
      rotate: [0, 45, 45],
      y: [0, 6, 6],
      x: 0,
      scaleX: 1,
    },
    closed: {
      rotate: 0,
      y: 0,
      x: 0,
      scaleX: 1,
    },
    middle: {
      open: { opacity: 0 },
      closed: { opacity: 1 },
    },
    bottom: {
      open: {
        rotate: [0, -45, -45],
        y: [0, -6, -6],
        x: 0,
        scaleX: 1,
      },
      closed: {
        rotate: 0,
        y: 0,
        x: 0,
        scaleX: 1,
      },
    },
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-gray-800 text-white font-medium text-sm text-center py-1.5 overflow-hidden relative">
        <div className="container mx-auto px-4 h-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnnouncement}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
              className="absolute w-full"
            >
              {announcements[currentAnnouncement]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Left Section: Logo & Main Nav Links */}
        <div className="flex items-center h-full">
          {/* Mobile Menu Toggle (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900 transition-colors focus:outline-none mr-4 p-1.5 rounded-md hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            <motion.div
              className="w-6 h-5 flex flex-col justify-between"
              animate={mobileMenuOpen ? "open" : "closed"}
              variants={hamburgerVariants}
            >
              <motion.span
                className="block h-0.5 w-full bg-gray-700"
                variants={lineVariants}
              ></motion.span>
              <motion.span
                className="block h-0.5 w-full bg-gray-700"
                variants={lineVariants.middle}
              ></motion.span>
              <motion.span
                className="block h-0.5 w-full bg-gray-700"
                variants={lineVariants.bottom}
              ></motion.span>
            </motion.div>
          </button>

          <Link to="/" className="flex-shrink-0 mr-8">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-base h-full">
            <NavLink to="/" className={desktopNavLinkClass} end>
              <FiHome className="text-base" /> Home
            </NavLink>

            {/* Shop Mega Menu Trigger (now simpler, no featured items) */}
            <div
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
              className="relative h-full flex items-center"
              ref={megaMenuRef}
            >
              <NavLink to="/shop" className={desktopNavLinkClass}>
                <FiLayers className="text-base" /> Shop
                <FiChevronDown
                  className={`transition-transform duration-200 ml-1 ${
                    megaMenuOpen ? "rotate-180" : ""
                  }`}
                  size={14}
                />
              </NavLink>
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    // Mega menu is now single column of categories
                    className="absolute left-0 top-full mt-4 w-auto min-w-[250px] max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
                    style={{ zIndex: 100 }}
                  >
                    <div className="p-4">
                      {" "}
                      {/* Simpler padding */}
                      {/* Shop By Category - now the only content */}
                      <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center border-b pb-2">
                        <FiTag className="mr-2 text-brb-primary" /> Shop By
                        Category
                      </h3>
                      <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {navCategories.length > 0 ? (
                          navCategories.map((cat) => (
                            <Link
                              key={cat}
                              to={`/shop/category/${encodeURIComponent(cat)}`}
                              className={megaMenuLinkClass}
                              onClick={() => setMegaMenuOpen(false)}
                            >
                              {cat}
                            </Link>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No categories available.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to="/contact" className={desktopNavLinkClass}>
              <FiPhone className="text-base" /> Contact
            </NavLink>
          </div>
        </div>

        {/* Right Section: Icons (Wishlist, Cart, User Dropdown) */}
        <div className="flex items-center space-x-5 text-gray-700 h-full">
          {/* Wishlist Icon */}
          <Link
            to="/favorites"
            aria-label="Favorites"
            className="relative hover:text-brb-primary transition-colors text-xl"
          >
            <FiHeart />
            {wishlistItems && wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-pink-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-ping-once">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          {/* Shopping Cart Icon */}
          <button
            onClick={() => cartDispatch({ type: "OPEN_CART" })}
            aria-label="Shopping Cart"
            className="relative hover:text-brb-primary transition-colors text-xl"
          >
            <FiShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-brb-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-ping-once">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </button>
          {/* User Dropdown (Desktop Only) */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            {userInfo ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 focus:outline-none hover:text-brb-primary transition-colors text-xl"
                aria-label="User menu"
              >
                <FiUser />
                <FiChevronDown
                  className={`transition-transform duration-200 text-base ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="hover:text-brb-primary transition-colors text-xl"
              >
                <FiUser />
              </Link>
            )}
            <AnimatePresence>
              {dropdownOpen && userInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 z-20"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Hello, {userInfo.name.split(" ")[0]}!
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userInfo.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brb-primary transition-colors flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiSettings className="mr-2" /> Your Profile
                  </Link>

                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brb-primary transition-colors font-semibold border-t border-gray-100 mt-1 pt-2 flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiGlobe className="mr-2" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left  px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100 mt-1 pt-2 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Off-Canvas - Full Screen Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed inset-0 bg-white z-40 p-6 md:hidden overflow-y-auto"
            ref={mobileMenuRef}
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Logo />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-gray-900 transition-colors text-3xl p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                aria-label="Close mobile menu"
              >
                <FiX />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
                end
              >
                <FiHome className="mr-3 text-2xl" /> Home
              </NavLink>
              <NavLink
                to="/shop"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiLayers className="mr-3 text-2xl" /> Shop
              </NavLink>
              {/* Categories within mobile menu */}
              {navCategories.length > 0 && (
                <div className="pl-6 border-l-2 border-gray-200 ml-4 space-y-1">
                  <p className="text-gray-600 text-sm font-semibold mt-2 mb-1">
                    Shop By Category:
                  </p>
                  {navCategories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/shop/category/${encodeURIComponent(cat)}`}
                      className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      - {cat}
                    </Link>
                  ))}
                </div>
              )}
              <NavLink
                to="/contact"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiPhone className="mr-3 text-2xl" /> Contact
              </NavLink>

              <div className="border-t border-gray-200 my-4"></div>

              {/* User/Auth Links in Mobile Menu */}
              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    className={`${mobileNavLinkClass({ isActive: false })}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="mr-3 text-2xl" /> Your Profile
                  </Link>

                  <Link
                    to="/favorites"
                    className={`${mobileNavLinkClass({ isActive: false })}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiHeart className="mr-3 text-2xl" /> My Wishlist
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className={`${mobileNavLinkClass({
                        isActive: false,
                      })} font-semibold`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiGlobe className="mr-3 text-2xl" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left block px-4 py-3 text-lg text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                  >
                    <FiLogOut className="mr-3 text-2xl" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="mr-3 text-2xl" /> Login / Register
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
