import { useState, useEffect, useRef } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import API from "../services/api";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";

// Component Imports
import SearchBox from "../components/common/SearchBox";
import ProductCard from "../components/products/ProductCard";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import Modal from "../components/common/Modal";
import QuickView from "../components/products/QuickView";
import FilterDrawer from "../components/common/FilterDrawer";

// Icon Imports
import {
  FiFilter,
  FiSearch,
  FiShoppingBag,
  FiTag, // For filter chips
  FiXCircle, // For clearing filters/chips
  FiGrid, // For header icon
  FiChevronRight, // For pagination
  FiChevronLeft, // For pagination
  FiArrowUpCircle, // For scroll to top FAB
} from "react-icons/fi"; // Feather Icons

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams(); // URL category param

  // State derived from URL search parameters
  const pageNumber = searchParams.get("page") || 1;
  const sortBy = searchParams.get("sort") || "latest";
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";
  const urlKeyword = searchParams.get("keyword") || "";

  // Component local states
  const [mainProductsData, setMainProductsData] = useState({
    products: [],
    page: 1,
    pages: 1,
  });
  const [categories, setCategories] = useState([]); // All available categories
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [quickViewProductId, setQuickViewProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(urlKeyword);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // New state for scroll-to-top button

  // --- Debounce search term changes and update URL ---
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        currentParams.set("keyword", searchTerm);
      } else {
        currentParams.delete("keyword");
      }
      currentParams.delete("page");
      setSearchParams(currentParams, { replace: true });
    }, 500);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm, setSearchParams]);

  // --- Fetch Products and Categories based on URL params ---
  useEffect(() => {
    const fetchAllShopData = async () => {
      setLoading(true);
      try {
        const params = {
          keyword: searchParams.get("keyword"),
          pageNumber,
          category,
          minPrice: searchParams.get("minPrice"),
          maxPrice: searchParams.get("maxPrice"),
          sort: searchParams.get("sort") || "latest",
        };
        const [mainRes, categoriesRes] = await Promise.all([
          API.get(`/products`, { params }),
          API.get("/products/categories"),
        ]);
        setMainProductsData(mainRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        toast.error(
          `Failed to load shop data: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllShopData();
  }, [category, pageNumber, searchParams]);

  // --- Pagination handler ---
  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", newPage.toString());
    const basePath = category ? `/shop/category/${category}` : "/shop";
    navigate(`${basePath}?${currentParams.toString()}`);
    window.scrollTo(0, 0); // Scroll to top of page
  };

  // --- Apply Price Filter handler ---
  const handlePriceFilter = (e) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams);
    if (minPrice) currentParams.set("minPrice", minPrice.toString());
    else currentParams.delete("minPrice");
    if (maxPrice) currentParams.set("maxPrice", maxPrice.toString());
    else currentParams.delete("maxPrice");
    currentParams.delete("page");
    setSearchParams(currentParams);
    setIsFilterDrawerOpen(false);
  };

  // --- Sort Change handler ---
  const handleSortChange = (newSortValue) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("sort", newSortValue);
    currentParams.delete("page");
    setSearchParams(currentParams);
    setIsFilterDrawerOpen(false);
  };

  // --- Clear all filters handler ---
  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    const currentParams = new URLSearchParams();
    currentParams.set("sort", "latest"); // Set default sort explicitly
    setSearchParams(currentParams);
    navigate("/shop"); // Navigate to base shop URL
    setIsFilterDrawerOpen(false);
  };

  // --- Calculate active filter count for display ---
  const getActiveFilterCount = () => {
    let count = 0;
    if (urlKeyword) count++;
    if (urlMinPrice || urlMaxPrice) count++;
    if (category && category !== "all") count++;
    if (sortBy !== "latest") count++;
    return count;
  };
  const activeFilterCount = getActiveFilterCount();

  // --- Scroll to top button logic ---
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        // Show button after scrolling 300px
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --- Framer Motion variants for page sections ---
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const productGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }, // Grid fades out completely
  };

  const productCardItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // --- Dynamic Header Content ---
  const headerTitle = category
    ? `${decodeURIComponent(category)} Collection`
    : urlKeyword
    ? `Search Results for "${urlKeyword}"`
    : "Shop Our Collection";

  const headerDescription = category
    ? `Explore our curated selection of handcrafted ${decodeURIComponent(
        category
      )} brass art.`
    : urlKeyword
    ? `Found ${mainProductsData.products.length} items matching your search.`
    : "Discover unique handcrafted brass art and decorative items for your home.";

  // --- Breadcrumbs ---
  const renderBreadcrumbs = () => {
    if (!category && !urlKeyword) return null;

    return (
      <nav className="text-sm text-gray-600 mb-4 md:mb-6">
        <ol className="list-none p-0 inline-flex items-center">
          <li className="flex items-center">
            <Link
              to="/shop"
              className="hover:text-brb-primary transition-colors"
            >
              Shop
            </Link>
          </li>
          {category && (
            <li className="flex items-center">
              <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <span className="font-semibold text-gray-800">
                {decodeURIComponent(category)}
              </span>
            </li>
          )}
          {urlKeyword && (
            <li className="flex items-center">
              <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <span className="font-semibold text-gray-800">
                "{urlKeyword}"
              </span>
            </li>
          )}
        </ol>
      </nav>
    );
  };

  // Filter options for Active Filter Tags display (should match FilterDrawer's sortOptions)
  const sortOptions = [
    { value: "latest", label: "Newest Arrivals" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "toprated", label: "Avg. Customer Review" },
  ];

  return (
    <>
      <Helmet>
        <title>{headerTitle} - BRB Art Fusion</title>
        <meta name="description" content={headerDescription} />
      </Helmet>

      {/* Filter Drawer Component (Off-Canvas) */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        categories={categories}
        category={category}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        handlePriceFilter={handlePriceFilter}
        clearFilters={clearFilters}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}

          {/* Page Header / Hero Section */}
          <motion.div
            className="text-center mb-10 pb-6 rounded-xl bg-gradient-to-br from-white to-brb-primary-light border border-gray-200 shadow-lg" /* Subtle gradient background for hero */
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight pt-6 flex items-center justify-center">
              <FiGrid className="inline-block mr-4 text-brb-primary text-4xl md:text-5xl lg:text-6xl" />
              {headerTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {headerDescription}
            </p>
          </motion.div>

          {/* Search & Filter Bar (Sticky on scroll) */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-xl border border-gray-100 sticky top-[72px] sm:top-[64px] lg:top-[64px] z-20" /* Stronger shadow, slightly higher */
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            {/* Search Box */}
            <div className="w-full md:w-1/3 flex-grow md:flex-grow-0">
              <SearchBox
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
              />
            </div>

            {/* Filters & Sort Button (Desktop) */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="hidden md:flex items-center justify-center gap-2 px-6 py-3 border-2 border-brb-primary text-brb-primary rounded-lg font-semibold hover:bg-brb-primary-light transition-colors shadow-sm relative text-lg flex-shrink-0" /* Hidden on mobile */
            >
              <FiFilter className="text-xl" />
              <span>Filters & Sort</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-ping-once border-2 border-red-500">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </motion.div>

          {/* Active Filter Tags (NEW Feature: Displaying applied filters) */}
          {(urlKeyword ||
            urlMinPrice ||
            urlMaxPrice ||
            (category && category !== "all") ||
            sortBy !== "latest") && (
            <motion.div
              className="mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-100 flex flex-wrap items-center gap-3"
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <span className="text-gray-700 font-semibold text-sm mr-2">
                Active Filters:
              </span>
              {urlKeyword && (
                <span className="inline-flex items-center bg-brb-primary text-white rounded-full px-3 py-1 text-sm font-medium">
                  Search: "{urlKeyword}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSearchParams(
                        (prev) => {
                          prev.delete("keyword");
                          prev.delete("page");
                          return prev;
                        },
                        { replace: true }
                      );
                    }}
                    className="ml-1.5 p-0.5 rounded-full hover:bg-white/20"
                  >
                    <FiXCircle size={14} />
                  </button>
                </span>
              )}
              {(urlMinPrice || urlMaxPrice) && (
                <span className="inline-flex items-center bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                  Price: ₹{urlMinPrice || "0"} - ₹{urlMaxPrice || "Max"}
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setSearchParams(
                        (prev) => {
                          prev.delete("minPrice");
                          prev.delete("maxPrice");
                          prev.delete("page");
                          return prev;
                        },
                        { replace: true }
                      );
                    }}
                    className="ml-1.5 p-0.5 rounded-full hover:bg-white/20"
                  >
                    <FiXCircle size={14} />
                  </button>
                </span>
              )}
              {category && category !== "all" && (
                <span className="inline-flex items-center bg-purple-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                  Category: {decodeURIComponent(category)}
                  <button
                    onClick={() => navigate("/shop", { replace: true })}
                    className="ml-1.5 p-0.5 rounded-full hover:bg-white/20"
                  >
                    <FiXCircle size={14} />
                  </button>
                </span>
              )}
              {sortBy !== "latest" && (
                <span className="inline-flex items-center bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                  Sort:{" "}
                  {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                    sortBy}
                  <button
                    onClick={() => {
                      handleSortChange("latest");
                    }}
                    className="ml-1.5 p-0.5 rounded-full hover:bg-white/20"
                  >
                    <FiXCircle size={14} />
                  </button>
                </span>
              )}
              {activeFilterCount > 0 && ( // Clear all button
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors text-sm font-semibold ml-auto"
                >
                  <FiXCircle className="mr-1" /> Clear All
                </button>
              )}
            </motion.div>
          )}

          <main>
            {loading ? (
              // Loading State: Product Card Skeletons
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-x-6 sm:gap-y-8 lg:gap-x-8 lg:gap-y-10">
                {[...Array(mainProductsData.products.length || 10)].map(
                  (_, index) => (
                    <ProductCardSkeleton key={index} />
                  )
                )}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {mainProductsData.products.length > 0 ? (
                  // Product Grid
                  <motion.div
                    key="product-grid"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-x-6 sm:gap-y-8 lg:gap-x-8 lg:gap-y-10"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={productGridVariants}
                  >
                    {mainProductsData.products.map((product) => (
                      <motion.div
                        key={product._id}
                        variants={productCardItemVariants}
                        onClick={() => setQuickViewProductId(product._id)}
                        layout
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  // No Products Found State
                  <motion.div
                    key="no-products"
                    className="text-center py-16 px-4 bg-white rounded-xl shadow-lg border border-gray-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <FiShoppingBag className="mx-auto text-7xl text-gray-400 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      No Products Found
                    </h3>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                      We couldn't find any items matching your current search or
                      filters.
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="mt-6 inline-flex items-center bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors shadow-md"
                      >
                        <FiXCircle className="mr-2" /> Clear All Filters
                      </button>
                    )}
                    {urlKeyword && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          navigate(
                            category ? `/shop/category/${category}` : "/shop"
                          );
                        }}
                        className={`mt-6 ${
                          activeFilterCount > 0 ? "ml-4" : ""
                        } inline-flex items-center bg-brb-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brb-primary-dark transition-colors shadow-md`}
                      >
                        <FiSearch className="mr-2" /> Clear Search
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Pagination */}
            {mainProductsData.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <ReactPaginate
                  nextLabel={
                    <FiChevronRight className="text-xl" />
                  } /* Custom Next Button */
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={mainProductsData.pages}
                  forcePage={mainProductsData.page - 1}
                  previousLabel={
                    <FiChevronLeft className="text-xl" />
                  } /* Custom Previous Button */
                  // Apply custom classes to container and links
                  containerClassName="pagination flex items-center space-x-2 p-3 bg-white rounded-xl shadow-md border border-gray-100"
                  pageLinkClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-base font-medium"
                  previousLinkClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-base font-medium flex items-center justify-center"
                  nextLinkClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-base font-medium flex items-center justify-center"
                  breakLinkClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-base font-medium"
                  activeLinkClassName="!bg-brb-primary !text-white !border-brb-primary hover:!bg-brb-primary-dark"
                  disabledClassName="opacity-50 cursor-not-allowed"
                  renderOnZeroPageCount={null}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Action Button (FAB) for Filters - Mobile Only */}
      <motion.button
        onClick={() => setIsFilterDrawerOpen(true)}
        className="fixed bottom-6 right-6 md:hidden bg-brb-primary text-white rounded-full p-4 shadow-xl z-30 transform hover:scale-110 transition-transform duration-200 animate-pulse-once" /* Added pulse-once */
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
        aria-label="Open filters"
      >
        <FiFilter className="text-2xl" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-ping-once border-2 border-red-500">
            {activeFilterCount}
          </span>
        )}
      </motion.button>

      {/* Scroll To Top Button - Mobile & Desktop */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 bg-gray-700 text-white rounded-full p-3 shadow-xl z-30 transform hover:scale-110 transition-transform duration-200"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            aria-label="Scroll to top"
          >
            <FiArrowUpCircle className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* QuickView Modal */}
      <Modal
        isOpen={!!quickViewProductId}
        onClose={() => setQuickViewProductId(null)}
      >
        {quickViewProductId && <QuickView productId={quickViewProductId} />}
      </Modal>
    </>
  );
};

export default ShopPage;
