import { Link } from "react-router-dom";
import { FiStar, FiShoppingCart } from "react-icons/fi"; // Using Feather Icons
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion"; // For animations

import FavoriteButton from "./FavoriteButton"; // Your existing FavoriteButton
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { toast } from "sonner";

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const ProductCard = ({ product }) => {
  const { dispatch: cartDispatch } = useContext(CartContext);

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent click from bubbling to the Link

    if (product.countInStock > 0) {
      cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty: 1 } });
      toast.success(`"${product.name}" added to cart!`);
    } else {
      toast.error("This product is currently out of stock.");
    }
  };

  const isOutOfStock = product.countInStock === 0;

  // Helper to format price safely
  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "0.00";

  // Framer Motion variants for the hover overlay and buttons
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Link
      to={`/product/${product._id}`}
      // Main card container: square aspect ratio, elegant shadows, border for definition
      className="block group relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer border border-gray-100"
    >
      {/* Product Image - Main visual, scales slightly on hover */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <LazyLoadImage
          alt={product.name}
          src={product.images?.[0] || placeholderImage}
          effect="blur"
          placeholderSrc={placeholderImage}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Out of Stock Badge - Always visible, top left */}
      {isOutOfStock && (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10 tracking-wide uppercase">
          Out of Stock
        </div>
      )}

      {/* Content Overlay (always visible - name, price, rating) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-95 backdrop-blur-sm z-10">
        {" "}
        {/* Semi-transparent white overlay with blur */}
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
          {product.name}
        </h3>
        {/* Price & Rating - Stacked or side-by-side depending on space */}
        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <p className="text-xl font-extrabold text-brb-primary">
            ₹{formatPrice(product.price)}
          </p>
          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={
                    i < Math.round(product.rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-xs text-gray-500 ml-0.5">
                ({product.numReviews})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Overlay - Reveals buttons on hover, covers the image */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex flex-col items-center justify-center space-y-4 z-20"
        initial="hidden"
        whileHover="visible"
        variants={overlayVariants}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Favorite Button */}
        <motion.div
          variants={buttonVariants}
          transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
        >
          <FavoriteButton product={product} />
        </motion.div>

        {/* Add to Cart Button */}
        <motion.div
          variants={buttonVariants}
          transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
        >
          <button
            onClick={addToCartHandler}
            disabled={isOutOfStock}
            className={`
              flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold
              bg-white text-gray-800 hover:bg-gray-100 hover:text-brb-primary transition-all duration-200 shadow-lg
              disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed
            `}
          >
            <FiShoppingCart className="text-lg" />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
