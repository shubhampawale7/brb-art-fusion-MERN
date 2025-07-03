import { useState, useEffect, useContext } from "react"; // Added useContext
import API from "../../services/api";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import {
  FiShoppingCart, // For Add to Cart button
  FiEye, // For View Full Details button (or a more generic "view" icon)
  FiDollarSign, // For price icon
  FiLayers, // For category
  FiBox, // For stock
} from "react-icons/fi"; // Using Feather Icons
import { toast } from "sonner";
import { CartContext } from "../../context/CartContext"; // Import CartContext
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext for potential login check if needed later

const QuickView = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dispatch: cartDispatch } = useContext(CartContext); // Use CartContext

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        setLoading(true);
        try {
          const { data } = await API.get(`/products/${productId}`);
          setProduct(data);
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Failed to load product details."
          );
          setProduct(null); // Ensure product is null on error
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    // Removed 'e' as it's not needed for a direct call
    if (product.countInStock > 0) {
      cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty: 1 } });
      toast.success(`"${product.name}" added to cart!`);
    } else {
      toast.error("This product is currently out of stock.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        {" "}
        {/* Adjusted height for better spinner visibility */}
        <ClipLoader color="#BFA181" size={50} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-gray-700 text-lg font-medium">
        Product details could not be loaded.
      </div>
    );
  }

  const isOutOfStock = product.countInStock === 0;
  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 p-2">
      {" "}
      {/* Added more gap, some internal padding */}
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-100 flex items-center justify-center bg-gray-50">
        {" "}
        {/* Added shadow and border to image container */}
        <img
          src={product.images?.[0] || "placeholder_image_url"} // Added safe access and placeholder
          alt={product.name}
          className="w-full h-auto object-contain max-h-[400px] md:max-h-[500px] rounded-xl" // object-contain to prevent cropping, max-h for responsiveness
        />
        {isOutOfStock && (
          <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
            Out of Stock
          </div>
        )}
      </div>
      {/* Product Details */}
      <div className="flex flex-col">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
          {product.name}
        </h2>

        {/* Price */}
        <p className="text-3xl lg:text-4xl font-extrabold text-brb-primary mb-4 flex items-center">
          <FiDollarSign className="mr-2" /> ₹{formatPrice(product.price)}
        </p>

        {/* Short Description */}
        <p className="text-gray-700 mb-6 leading-relaxed text-base">
          {product.description.substring(0, 150)}
          {product.description.length > 150 ? "..." : ""}{" "}
          {/* Ensure ... only if truncated */}
        </p>

        {/* Additional Info (Optional - Category, Stock) */}
        <div className="mb-6 space-y-2 text-gray-600 text-sm">
          {product.category && (
            <p className="flex items-center">
              <FiLayers className="mr-2 text-gray-500" />{" "}
              <strong>Category:</strong> {product.category}
            </p>
          )}
          <p className="flex items-center">
            <FiBox className="mr-2 text-gray-500" />
            <strong>Availability:</strong>
            <span
              className={`ml-1 font-semibold ${
                isOutOfStock ? "text-red-600" : "text-green-600"
              }`}
            >
              {isOutOfStock
                ? "Out of Stock"
                : `${product.countInStock} In Stock`}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-auto pt-4 border-t border-gray-100">
          {" "}
          {/* mt-auto pushes to bottom */}
          <button
            onClick={addToCartHandler}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center bg-brb-primary text-white px-6 py-3 rounded-lg hover:bg-brb-primary-dark transition-colors font-semibold text-lg shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FiShoppingCart className="mr-2" />{" "}
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <Link
            to={`/product/${product._id}`}
            className="flex-1 flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:border-brb-primary hover:text-brb-primary transition-all text-lg shadow-sm"
            onClick={() => {
              /* assuming this QuickView is in a Modal, you might want to onClose here */
            }}
          >
            <FiEye className="mr-2" /> View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
