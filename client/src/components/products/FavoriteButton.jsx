import { useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
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
    e.stopPropagation();

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
        toast.success("Removed from favorites");
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
        toast.success("Added to favorites!");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <button
      onClick={toggleWishlistHandler}
      className="bg-white p-3 rounded-full shadow-md text-gray-400 hover:text-brand-accent hover:scale-110 transition-all z-10"
      aria-label="Add to Favorites"
    >
      <FaHeart
        className={`text-xl ${isFavorited ? "text-brand-accent" : ""}`}
      />
    </button>
  );
};

export default FavoriteButton;
