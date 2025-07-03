import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiFilter, // Icon for Filter header
  FiChevronRight, // Icon for active sort/category
  FiDollarSign, // Icon for Price Range
  FiTag, // Icon for Category
  FiRefreshCw, // Icon for Clear All Filters
  FiArrowUp, // For price sort icon
  FiArrowDown, // For price sort icon
  FiStar, // For Top Rated sort icon
  FiClock, // For Newest Arrivals sort icon
} from "react-icons/fi"; // Using Feather Icons
import { useEffect, useRef } from "react";

// A small helper component for filter sections
const FilterSection = ({ title, children, icon: Icon }) => (
  <div className="border-b border-gray-200 py-5 last:border-b-0">
    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
      {Icon && <Icon className="mr-2 text-brb-primary text-xl" />}
      {title}
    </h3>
    {children}
  </div>
);

const FilterDrawer = ({
  isOpen,
  onClose,
  categories,
  category,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handlePriceFilter,
  clearFilters,
  sortBy,
  onSortChange,
}) => {
  // Use a ref for the drawer content to allow closing on outside click
  const drawerRef = useRef(null);

  // Close drawer on outside click - standard pattern
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const activeLinkClass = "text-brb-primary font-bold"; // Your brand primary for active
  const normalLinkClass = "text-gray-700 hover:text-brb-primary-dark"; // Softer hover
  const priceInputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition-all duration-200 text-gray-800 text-sm";
  const applyButtonClass =
    "w-full bg-brb-primary text-white py-2.5 rounded-md font-semibold hover:bg-brb-primary-dark transition-colors shadow-sm mt-3 flex items-center justify-center";

  const sortOptions = [
    { value: "latest", label: "Newest Arrivals", icon: FiClock },
    { value: "price_asc", label: "Price: Low to High", icon: FiArrowUp },
    { value: "price_desc", label: "Price: High to Low", icon: FiArrowDown },
    { value: "toprated", label: "Avg. Customer Review", icon: FiStar },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={onClose}
          ></motion.div>

          {/* Drawer */}
          <motion.div
            ref={drawerRef} // Attach ref here
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col rounded-r-xl overflow-hidden" // Added rounded-r-xl for modern look
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FiFilter className="mr-3 text-brb-primary text-3xl" /> Filters
                & Sort
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 transition-colors text-3xl p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Close filters"
              >
                <FiX />
              </button>
            </div>

            {/* Filters Body */}
            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
              {" "}
              {/* Added custom-scrollbar */}
              {/* Sort By Section */}
              <FilterSection title="Sort By" icon={FiRefreshCw}>
                {" "}
                {/* Using FiRefreshCw as a sort-related icon */}
                <div className="flex flex-col items-start gap-3 text-base">
                  {" "}
                  {/* Text-base for larger links */}
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`text-left w-full flex items-center transition-colors duration-200 rounded-md py-2 px-3
                        ${
                          sortBy === option.value ||
                          (option.value === "latest" &&
                            !sortOptions.some((o) => o.value === sortBy))
                            ? activeLinkClass + " bg-gray-100" // Highlight active sort with light background
                            : normalLinkClass + " hover:bg-gray-50"
                        }`}
                    >
                      {option.icon && <option.icon className="mr-2" />}{" "}
                      {/* Render icon */}
                      {option.label}
                      {(sortBy === option.value ||
                        (option.value === "latest" &&
                          !sortOptions.some((o) => o.value === sortBy))) && (
                        <FiChevronRight className="ml-auto text-lg" /> // Active indicator
                      )}
                    </button>
                  ))}
                </div>
              </FilterSection>
              {/* Price Range Section */}
              <FilterSection title="Price Range" icon={FiDollarSign}>
                <form onSubmit={handlePriceFilter} className="space-y-3">
                  <div className="flex items-center gap-3">
                    {" "}
                    {/* Increased gap */}
                    <div className="flex-1">
                      <label htmlFor="minPrice" className="sr-only">
                        Minimum Price
                      </label>
                      <input
                        id="minPrice"
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className={priceInputClass}
                        min="0"
                      />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="flex-1">
                      <label htmlFor="maxPrice" className="sr-only">
                        Maximum Price
                      </label>
                      <input
                        id="maxPrice"
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className={priceInputClass}
                        min="0"
                      />
                    </div>
                  </div>
                  <button type="submit" className={applyButtonClass}>
                    Apply Filter
                  </button>
                </form>
              </FilterSection>
              {/* Category Section */}
              <FilterSection title="Category" icon={FiTag}>
                <ul className="space-y-3 text-base">
                  {" "}
                  {/* Text-base for larger links */}
                  <li>
                    <Link
                      to="/shop"
                      className={`flex items-center w-full rounded-md py-2 px-3 transition-colors duration-200
                        ${
                          !category
                            ? activeLinkClass + " bg-gray-100"
                            : normalLinkClass + " hover:bg-gray-50"
                        }`}
                      onClick={() => {
                        clearFilters();
                        onClose();
                      }}
                    >
                      All Products
                      {!category && (
                        <FiChevronRight className="ml-auto text-lg" />
                      )}
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/shop/category/${encodeURIComponent(cat)}`}
                        className={`flex items-center w-full rounded-md py-2 px-3 transition-colors duration-200
                          ${
                            category === cat
                              ? activeLinkClass + " bg-gray-100"
                              : normalLinkClass + " hover:bg-gray-50"
                          }`}
                        onClick={onClose}
                      >
                        {cat}
                        {category === cat && (
                          <FiChevronRight className="ml-auto text-lg" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FilterSection>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0">
              {" "}
              {/* Sticky footer */}
              <button
                onClick={() => {
                  clearFilters();
                  onClose();
                }}
                className="w-full text-center py-3 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg transition-colors shadow-sm flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2" /> Clear All Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
