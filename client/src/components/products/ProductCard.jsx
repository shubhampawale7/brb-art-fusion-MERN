import { Link } from "react-router-dom";
import ParallaxTilt from "react-parallax-tilt";
import FavoriteButton from "./FavoriteButton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const placeholderImage = "/images/placeholder.png";

const ProductCard = ({ product, onQuickViewClick }) => {
  return (
    <ParallaxTilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden m-2 group relative">
        <FavoriteButton product={product} />

        <Link to={`/product/${product._id}`}>
          <div className="overflow-hidden relative">
            <LazyLoadImage
              alt={product.name}
              src={product.images[0]}
              effect="blur"
              placeholderSrc={placeholderImage}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
            {/* Quick View Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigating to product page
                  onQuickViewClick(); // Open the modal
                }}
                className="text-white bg-brand-accent px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Quick View
              </button>
            </div>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-serif font-bold text-text-primary truncate">
              {product.name}
            </h3>
            <p className="text-xl text-brand-gold mt-2">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        </Link>
      </div>
    </ParallaxTilt>
  );
};

export default ProductCard;
