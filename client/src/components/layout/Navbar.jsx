import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [navCategories, setNavCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);

  // --- START: Logic for the new Announcement Ticker ---
  const announcements = [
    "✨ Free Shipping on All Orders Above ₹2000 ✨",
    "🎉 New Arrivals are Here! Shop Now! 🎉",
    " handcrafted with ❤️ from India",
    "🎁 The Perfect Gift for Any Occasion 🎁",
  ];
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000); // Change announcement every 4 seconds
    return () => clearInterval(timer);
  }, [announcements.length]);
  // --- END: Logic for the new Announcement Ticker ---

  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { cartItems } = cartState;
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const { userInfo } = authState;
  const { state: wishlistState, dispatch: wishlistDispatch } =
    useContext(WishlistContext);
  const { wishlistItems } = wishlistState;

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [categoriesRes, featuredRes] = await Promise.all([
          API.get("/products/categories"),
          API.get("/products?sort=latest&limit=2"),
        ]);
        setNavCategories(categoriesRes.data);
        setFeaturedItems(featuredRes.data.products);
      } catch (error) {
        console.error("Failed to fetch menu data", error);
      }
    };
    fetchMenuData();
  }, []);

  const logoutHandler = () => {
    authDispatch({ type: "USER_LOGOUT" });
    cartDispatch({ type: "CART_CLEAR" });
    wishlistDispatch({ type: "CLEAR_WISHLIST" });
    toast.success("You have been logged out successfully.");
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const desktopNavLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 transition-colors duration-300 ${
      isActive
        ? "text-brand-accent"
        : "text-text-primary hover:text-brand-accent"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded text-lg ${
      isActive
        ? "bg-brand-accent text-white"
        : "text-text-primary hover:bg-page-bg"
    }`;

  const megaMenuLinkClass =
    "block p-2 text-text-primary hover:bg-page-bg rounded-md transition-colors";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* --- START: Redesigned Announcement Bar --- */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-bold text-sm text-center">
        <div className="container mx-auto px-6 h-10 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnnouncement}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              {announcements[currentAnnouncement]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* --- END: Redesigned Announcement Bar --- */}

      {/* Main Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* ... Rest of your Navbar code remains the same ... */}
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-lg font-semibold">
          <NavLink to="/" className={desktopNavLinkClass}>
            Home
          </NavLink>
          <div
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
            className="py-2"
          >
            <NavLink to="/shop" className={desktopNavLinkClass}>
              Shop
              <FaChevronDown
                className={`transition-transform duration-200 ${
                  megaMenuOpen ? "rotate-180" : ""
                }`}
                size={12}
              />
            </NavLink>
            <AnimatePresence>
              {megaMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-0 bg-white shadow-lg border-t"
                  style={{ zIndex: 100 }}
                >
                  <div className="container mx-auto grid grid-cols-4 gap-8 p-8 max-h-[450px] overflow-hidden">
                    <div className="space-y-3 pr-4 overflow-y-auto">
                      <h3 className="font-bold text-text-primary mb-2 sticky top-0 bg-white pb-2">
                        Shop By Category
                      </h3>
                      {navCategories.map((cat) => (
                        <Link
                          key={cat}
                          to={`/shop/category/${cat}`}
                          className={megaMenuLinkClass}
                          onClick={() => setMegaMenuOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-text-primary mb-2">
                        New Arrivals
                      </h3>
                      {featuredItems.map((item) => (
                        <Link
                          key={item._id}
                          to={`/product/${item._id}`}
                          className={megaMenuLinkClass}
                          onClick={() => setMegaMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    {featuredItems.length > 0 && (
                      <div className="col-span-2 h-full">
                        <Link
                          to={`/product/${featuredItems[0]._id}`}
                          onClick={() => setMegaMenuOpen(false)}
                        >
                          <img
                            src={featuredItems[0].images[0]}
                            alt={featuredItems[0].name}
                            className="rounded-md object-cover h-48 w-48"
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/contact" className={desktopNavLinkClass}>
            Contact
          </NavLink>
        </div>

        <div className="flex items-center space-x-4 text-text-primary">
          <Link
            to="/favorites"
            aria-label="Favorites"
            className="relative hover:text-brand-accent"
          >
            <FaHeart className="text-2xl" />
            {wishlistItems && wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => cartDispatch({ type: "OPEN_CART" })}
            aria-label="Shopping Cart"
            className="relative hover:text-brand-accent"
          >
            <FaShoppingCart className="text-2xl" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </button>
          <div className="hidden md:block relative" ref={dropdownRef}>
            {userInfo ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none hover:text-brand-accent"
              >
                <FaUser className="text-2xl" />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="hover:text-brand-accent"
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
                  className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                >
                  <div className="px-4 py-3 border-b border-page-bg">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {userInfo.name}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-page-bg"
                  >
                    Your Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-page-bg"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left block px-4 py-2 text-sm text-text-primary hover:bg-page-bg"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fully Functional Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink
                to="/"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </NavLink>
              <NavLink
                to="/contact"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
              <div className="border-t my-2 border-page-bg"></div>
              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    className={`${mobileNavLinkClass({
                      isActive: false,
                    })} text-text-primary`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className={`${mobileNavLinkClass({
                        isActive: false,
                      })} text-text-primary`}
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
                    className="w-full text-left block px-3 py-2 text-lg text-text-primary hover:bg-page-bg rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={mobileNavLinkClass}
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
