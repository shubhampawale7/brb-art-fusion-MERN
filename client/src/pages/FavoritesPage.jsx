import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";

const FavoritesPage = () => {
  const { state } = useContext(WishlistContext);
  const { wishlistItems, loading } = state;

  return (
    <>
      <Helmet>
        <title>My Favorites - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold font-serif mb-8">My Wishlist</h1>
        {loading ? (
          <p>Loading...</p>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-text-secondary">
              Your wishlist is empty.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-block bg-brand-accent text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritesPage;
