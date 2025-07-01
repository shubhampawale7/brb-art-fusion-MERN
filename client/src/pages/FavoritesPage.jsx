import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton"; // Import the skeleton
import { FiHeart } from "react-icons/fi"; // Import a new icon

const FavoritesPage = () => {
  const { state } = useContext(WishlistContext);
  const { wishlistItems, loading } = state;

  return (
    <>
      <Helmet>
        <title>My Favorites - BRB Art Fusion</title>
      </Helmet>
      <div className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900">
              My Wishlist
            </h1>
            {!loading && (
              <p className="mt-2 text-sm text-gray-500">
                You have {wishlistItems.length} item
                {wishlistItems.length !== 1 ? "s" : ""} in your wishlist.
              </p>
            )}
          </div>

          {/* Conditional Rendering */}
          {loading ? (
            // --- 1. Polished Loading State ---
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 lg:gap-x-8">
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            // --- 2. Enhanced Empty State ---
            <div className="text-center py-16 px-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <FiHeart
                  className="h-10 w-10 text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-800">
                Your Wishlist is Empty
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Looks like you haven't added anything yet. Let's find some
                treasures!
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-block bg-brand-accent text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-transform hover:scale-105"
              >
                Discover Products
              </Link>
            </div>
          ) : (
            // --- 3. Product Grid ---
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 lg:gap-x-8">
              {wishlistItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
