import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { FiHeart } from "react-icons/fi"; // Using Feather Icons for consistency
import { motion, AnimatePresence } from "framer-motion"; // For animations

const FavoritesPage = () => {
  const { state } = useContext(WishlistContext);
  const { wishlistItems, loading } = state;

  // Framer Motion variants for page entry
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Framer Motion variants for staggered grid items
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>My Favorites - BRB Art Fusion</title>
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-12 md:py-16 lg:py-20">
        {" "}
        {/* Soft background, generous padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            className="mb-10 text-center"
            initial="hidden"
            animate="visible"
            variants={pageVariants}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight flex items-center justify-center">
              <FiHeart className="inline-block mr-4 text-brb-primary text-4xl md:text-5xl" />
              My Wishlist
            </h1>
            {!loading && (
              <p className="text-lg text-gray-600">
                You have{" "}
                <span className="font-semibold text-brb-primary">
                  {wishlistItems.length}
                </span>{" "}
                item
                {wishlistItems.length !== 1 ? "s" : ""} in your wishlist.
              </p>
            )}
          </motion.div>

          {/* Conditional Rendering based on loading and wishlist content */}
          {loading ? (
            // --- 1. Polished Loading State ---
            <motion.div
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 lg:gap-x-8"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {[...Array(8)].map(
                (
                  _,
                  index // Show 8 skeleton loaders
                ) => (
                  <motion.div key={index} variants={itemVariants}>
                    <ProductCardSkeleton />
                  </motion.div>
                )
              )}
            </motion.div>
          ) : wishlistItems.length === 0 ? (
            // --- 2. Enhanced Empty State ---
            <motion.div
              className="text-center py-16 px-4 bg-white rounded-xl shadow-lg border border-gray-100"
              initial="hidden"
              animate="visible"
              variants={pageVariants}
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brb-primary-light mb-6">
                {" "}
                {/* Larger, branded circle */}
                <FiHeart
                  className="h-14 w-14 text-brb-primary" // Larger, branded icon
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Your Wishlist is Empty!
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-md mx-auto">
                Looks like you haven't added any favorite products yet. Start
                exploring our collection to find your next treasure.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center bg-brb-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brb-primary-dark transition-colors shadow-md"
              >
                <FiHeart className="mr-2" /> Discover Products
              </Link>
            </motion.div>
          ) : (
            // --- 3. Product Grid with Animations ---
            <motion.div
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 lg:gap-x-8"
              initial="hidden"
              animate="visible"
              variants={containerVariants} // Apply container staggering
            >
              <AnimatePresence>
                {" "}
                {/* For exit animations when items are removed */}
                {wishlistItems.map((product) => (
                  <motion.div key={product._id} variants={itemVariants} layout>
                    {" "}
                    {/* layout for smooth removal */}
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
