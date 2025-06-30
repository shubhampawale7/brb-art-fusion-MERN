import { Link } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
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

    if (product.countInStock > 0) {
      cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty: 1 } });
      toast.success(`${product.name} added to cart!`);
      cartDispatch({ type: "OPEN_CART" });
    } else {
      toast.error("This product is currently out of stock.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden m-2 p-4 group relative border border-transparent hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="h-64 overflow-hidden relative flex items-center justify-center bg-gray-100">
          <LazyLoadImage
            alt={product.name}
            src={product.images?.[0] || placeholderImage}
            effect="blur"
            placeholderSrc={placeholderImage}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteButton product={product} />
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-2 flex justify-center gap-2"
            initial={{ y: "100%", opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <button
              onClick={addToCartHandler}
              className="bg-brand-accent text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-opacity-90"
            >
              <FaShoppingCart />
            </button>
            {onQuickViewClick && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickViewClick();
                }}
                className="text-white bg-text-primary px-4 py-2 rounded-md font-semibold text-sm hover:bg-opacity-80"
              >
                Quick View
              </button>
            )}
          </motion.div>
        </div>

        <div className="p-4 text-center">
          <h3 className="text-lg font-serif font-bold text-text-primary truncate h-7">
            {product.name}
          </h3>
          <div className="flex justify-center items-center gap-4 mt-2">
            <p className="text-xl text-text-secondary">
              ₹{product.price?.toFixed(2)}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{product.rating?.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
