import { useContext } from "react";
import { FiHeart } from "react-icons/fi"; // Using Feather Icons for consistency
import { toast } from "sonner";
import { motion } from "framer-motion"; // Import motion for animations

import { AuthContext } from "../../context/AuthContext";
import { WishlistContext } from "../../context/WishlistContext";
import API from "../../services/api";

const FavoriteButton = ({ product }) => {
  const { state: authState } = useContext(AuthContext);
  const { state: wishlistState, dispatch: wishlistDispatch } =
    useContext(WishlistContext);

  // Check if the current product exists in the wishlist
  const isFavorited = wishlistState.wishlistItems.some(
    (p) => p._id === product._id
  );

  const toggleWishlistHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent click from bubbling up (e.g., to a product card link)

    if (!authState.userInfo) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    try {
      if (isFavorited) {
        // If it's already favorited, remove it
        await API.delete(`/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${authState.userInfo.token}` },
        });
        wishlistDispatch({ type: "REMOVE_FROM_WISHLIST", payload: product });
        toast.success(`"${product.name}" removed from favorites.`);
      } else {
        // If it's not favorited, add it
        await API.post(
          "/wishlist",
          { productId: product._id },
          {
            headers: { Authorization: `Bearer ${authState.userInfo.token}` },
          }
        );
        wishlistDispatch({ type: "ADD_TO_WISHLIST", payload: product });
        toast.success(`"${product.name}" added to favorites!`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // Framer Motion variants for the heart icon animation
  const heartVariants = {
    favorited: {
      scale: [1, 1.2, 1], // Pop out slightly when favorited
      opacity: [0.6, 1],
      color: "#DC2626", // Red for favorited state (Tailwind red-600)
      transition: { duration: 0.3, ease: "easeOut" }, // Changed type to tween and adjusted ease for pop effect
    },
    notFavorited: {
      scale: [1, 0.8, 1], // Shrink slightly when removed
      opacity: [1, 0.6],
      color: "#6B7280", // Gray for not favorited state (Tailwind gray-500)
      transition: { duration: 0.2, ease: "easeOut" }, // Changed type to tween and adjusted ease for shrink effect
    },
    initial: {
      // Initial state to avoid animation on first render if already in wishlist
      scale: 1,
      opacity: 1,
      color: isFavorited ? "#DC2626" : "#6B7280",
    },
  };

  return (
    <button
      onClick={toggleWishlistHandler}
      className={`
        bg-white p-3 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-brb-primary focus:ring-offset-2
        transition-shadow duration-200 ease-in-out
        ${isFavorited ? "hover:shadow-lg" : "hover:shadow-lg"}
      `}
      aria-label={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <motion.div
        key={isFavorited ? "favorited" : "notFavorited"} // Key change to re-trigger animation on state change
        initial="initial"
        animate={isFavorited ? "favorited" : "notFavorited"}
        variants={heartVariants}
      >
        <FiHeart className="text-xl" /> {/* Base size for the icon */}
      </motion.div>
    </button>
  );
};

export default FavoriteButton;
