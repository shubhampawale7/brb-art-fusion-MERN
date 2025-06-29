import { useState, useEffect } from "react";
import API from "../../services/api";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const QuickView = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        setLoading(true);
        const { data } = await API.get(`/products/${productId}`);
        setProduct(data);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading || !product) {
    return (
      <div className="h-96 flex justify-center items-center">
        <ClipLoader />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-serif font-bold">{product.name}</h2>
        <p className="text-3xl text-brand-accent my-3">
          ₹{product.price.toFixed(2)}
        </p>
        <p className="text-text-secondary mb-4">
          {product.description.substring(0, 150)}...
        </p>
        <div className="flex space-x-4">
          <button className="flex-grow flex items-center justify-center bg-brand-accent text-white px-6 py-3 rounded-md hover:bg-opacity-90 font-semibold">
            <FaShoppingCart className="mr-2" /> Add to Cart
          </button>
          <Link
            to={`/product/${product._id}`}
            className="flex-grow flex items-center justify-center border-2 border-text-primary px-6 py-3 rounded-md font-semibold hover:bg-page-bg"
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
