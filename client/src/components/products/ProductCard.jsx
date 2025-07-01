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
    <Link
      to={`/product/${product._id}`}
      // The group class enables the hover effects on child elements
      className="block group relative aspect-square w-full h-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* 1. Background Image: Zooms slightly on hover */}
      <LazyLoadImage
        alt={product.name}
        src={product.images?.[0] || placeholderImage}
        effect="blur"
        placeholderSrc={placeholderImage}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />

      {/* 2. Favorite Button (Top Right) */}
      <div className="absolute top-3 right-3 z-20 opacity-80 group-hover:opacity-100 transition-opacity">
        <FavoriteButton product={product} />
      </div>

      {/* Out of Stock Badge (if applicable) */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 bg-gray-900 bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          OUT OF STOCK
        </div>
      )}

      {/* 3. Main Content Overlay Container */}
      {/* This container now has the hover effect to slide up */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 flex flex-col justify-end text-white overflow-hidden transition-transform duration-500 ease-in-out group-hover:-translate-y-12">
        {/* On-brand gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/80 via-brand-accent/40 to-transparent"></div>

        <div className="relative p-4 z-10">
          {/* Product Name */}
          <h3 className="text-base font-bold truncate transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <p className="text-lg font-extrabold text-primary mt-1">
            ₹{product.price?.toFixed(2)}
          </p>

          {/* Details that appear on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 pt-3">
            <div className="flex justify-between items-center">
              {product.numReviews > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.round(product.rating)
                          ? "text-primary"
                          : "text-white/30"
                      }
                    />
                  ))}
                  <span className="text-xs text-white/70 ml-1">
                    ({product.numReviews})
                  </span>
                </div>
              )}
              <button
                onClick={addToCartHandler}
                disabled={isOutOfStock}
                // Styled to match your brand's gold accent
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-brand-gold text-brand-accent hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <FiShoppingCart />
                <span>{isOutOfStock ? "Out of Stock" : "Add"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
