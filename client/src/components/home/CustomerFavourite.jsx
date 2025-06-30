import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { toast } from "sonner";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { CartContext } from "../../context/CartContext";
import FavoriteButton from "../products/FavoriteButton";

const CustomerFavourite = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dispatch: cartDispatch } = useContext(CartContext);

  useEffect(() => {
    const fetchFavourite = async () => {
      try {
        // We will fetch a specific product by its name to feature it.
        // You can change this name to feature any product you like.
        const { data } = await API.get("/products?slug=Copper Tumbler");
        if (data.products.length > 0) {
          setProduct(data.products[0]);
        }
      } catch (error) {
        console.error("Failed to fetch favourite product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourite();
  }, []);

  const addToCartHandler = () => {
    if (product.countInStock > 0) {
      cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty: 1 } });
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("This product is currently out of stock.");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <ClipLoader />
      </div>
    );
  }

  if (!product) {
    return null; // Don't render anything if the product isn't found
  }

  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif">
            Customer's Favourite
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Gallery Side */}
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
            <div className="absolute top-4 right-4">
              <FavoriteButton product={product} />
            </div>
          </div>
          {/* Details Side */}
          <div className="flex flex-col">
            <h3 className="text-4xl font-serif font-bold text-text-primary">
              {product.name}
            </h3>
            <div className="flex items-center gap-4 my-4">
              <span className="text-3xl text-brand-accent font-bold">
                ₹{product.price.toFixed(2)}
              </span>
              <div className="flex items-center text-lg">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed mb-6">
              {product.description.substring(0, 200)}...
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={addToCartHandler}
                className="bg-brand-accent text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-all text-lg flex items-center"
              >
                <FaShoppingCart className="mr-2" /> Add To Cart
              </button>
              <Link
                to={`/product/${product._id}`}
                className="font-semibold hover:text-brand-accent underline"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CustomerFavourite;
