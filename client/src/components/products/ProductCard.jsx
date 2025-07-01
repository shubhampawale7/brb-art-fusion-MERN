import { Link } from "react-router-dom";
import { FaShoppingCart, FaStar, FaEye } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import FavoriteButton from "./FavoriteButton";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { toast } from "sonner";

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const ProductCard = ({ product, onQuickViewClick }) => {
  const { dispatch: cartDispatch } = useContext(CartContext);

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // This check is redundant if the button is disabled, but it's good practice
    if (product.countInStock > 0) {
      cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty: 1 } });
      toast.success(`${product.name} added to cart!`);
      cartDispatch({ type: "OPEN_CART" });
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickViewClick();
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="border border-gray-200 rounded-lg group overflow-hidden bg-white flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative w-full h-64 overflow-hidden">
          <LazyLoadImage
            alt={product.name}
            src={product.images?.[0] || placeholderImage}
            effect="blur"
            placeholderSrc={placeholderImage}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Quick View Button - Fades in on hover */}
          {onQuickViewClick && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleQuickViewClick}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-gray-100"
              >
                <FaEye />
                Quick View
              </button>
            </div>
          )}

          {/* Favorite Button - Always visible */}
          <div className="absolute top-3 right-3">
            <FavoriteButton product={product} />
          </div>

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-gray-900 bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-full">
              OUT OF STOCK
            </div>
          )}
        </div>
      </Link>

      {/* Product Info and Actions */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="text-base font-bold text-gray-800 truncate mb-1 hover:text-brand-accent">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <FaStar className="text-yellow-400" />
            <span>{product.rating?.toFixed(1)}</span>
            <span className="text-gray-400">
              ({product.numReviews} reviews)
            </span>
          </div>

          <p className="text-lg font-extrabold text-gray-900">
            ₹{product.price?.toFixed(2)}
          </p>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-4">
          <button
            onClick={addToCartHandler}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold text-white transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed bg-brand-accent hover:bg-opacity-90"
          >
            <FaShoppingCart />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
