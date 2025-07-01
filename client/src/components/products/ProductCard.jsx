import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import FavoriteButton from "./FavoriteButton";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { toast } from "sonner";

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const ProductCard = ({ product }) => {
  const { dispatch: cartDispatch } = useContext(CartContext);

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.countInStock > 0) {
      cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty: 1 } });
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("This product is currently out of stock.");
    }
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    // The entire card is a link and a positioning group for the overlay
    <Link
      to={`/product/${product._id}`}
      className="block group relative aspect-square w-full h-full overflow-hidden rounded-lg shadow-lg"
    >
      {/* 1. Background Image */}
      <LazyLoadImage
        alt={product.name}
        src={product.images?.[0] || placeholderImage}
        effect="blur"
        placeholderSrc={placeholderImage}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* 2. Favorite Button (Top Right) */}
      <div className="absolute top-3 right-3 z-20">
        <FavoriteButton product={product} />
      </div>

      {/* 3. Main Content Overlay (Bottom) */}
      <div
        // This gradient creates the dark background for the text
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
      >
        {/* Product Name */}
        <h3 className="text-base font-bold text-white truncate transition-colors group-hover:text-amber-300">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-lg font-extrabold text-amber-400 mt-1">
          ₹{product.price?.toFixed(2)}
        </p>

        {/* Reviews and Add to Cart Button - Revealed on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-3">
          <div className="flex justify-between items-center">
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating)
                        ? "text-amber-400"
                        : "text-gray-500"
                    }
                  />
                ))}
                <span className="text-xs text-gray-300 ml-1">
                  ({product.numReviews})
                </span>
              </div>
            )}
            <button
              onClick={addToCartHandler}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart />
              <span>{isOutOfStock ? "Out of Stock" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
