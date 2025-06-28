import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

// Import slick-carousel and react-photo-view styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-photo-view/dist/react-photo-view.css";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // State for review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  // Get contexts
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: authState } = useContext(AuthContext);
  const { userInfo } = authState;

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${productId}`);
      setProduct(data);
    } catch (error) {
      toast.error("Product not found or there was an error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    const existItem = cartState.cartItems.find((x) => x._id === product._id);
    const newQty = existItem ? existItem.qty + qty : qty;

    if (product.countInStock < newQty) {
      toast.error("Sorry, product is out of stock");
      return;
    }

    cartDispatch({
      type: "ADD_TO_CART",
      payload: { ...product, qty },
    });
    toast.success(`${qty} x ${product.name} added to cart!`);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setLoadingReview(true);
    try {
      await API.post(
        `/products/${productId}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Review submitted successfully!");
      fetchProduct(); // Refetch product data to show the new review
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoadingReview(false);
      setRating(0);
      setComment("");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    customPaging: (i) => (
      <div className="mt-2">
        <img
          src={product?.images[i]}
          alt=""
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>
    ),
    dotsClass: "slick-dots slick-thumb",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#BFA181" size={50} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 font-bold text-2xl">
        Product Not Found.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - BRB Art Fusion`}</title>
        <meta
          name="description"
          content={product.description.substring(0, 160)}
        />
      </Helmet>

      <motion.div
        className="container mx-auto px-6 pt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image Gallery Column */}
          <PhotoProvider>
            <Slider {...sliderSettings}>
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="cursor-pointer outline-none focus:outline-none"
                >
                  <PhotoView src={image}>
                    <img
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg"
                    />
                  </PhotoView>
                </div>
              ))}
            </Slider>
          </PhotoProvider>

          {/* Product Info Column */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold font-serif text-gray-800">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={
                      product.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                ({product.numReviews} reviews)
              </span>
            </div>
            <p className="text-3xl font-semibold text-[#BFA181]">
              ₹{product.price.toFixed(2)}
            </p>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Availability:</span>
              <span
                className={
                  product.countInStock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.countInStock > 0
                  ? `In Stock (${product.countInStock} left)`
                  : "Out of Stock"}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex flex-col space-y-4 pt-4">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-2 border-r hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 font-bold">{qty}</span>
                    <button
                      onClick={() =>
                        setQty((prev) =>
                          Math.min(product.countInStock, prev + 1)
                        )
                      }
                      className="px-3 py-2 border-l hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={addToCartHandler}
                    className="flex-grow flex items-center justify-center bg-[#BFA181] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition disabled:bg-gray-400"
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button
                    className="flex items-center justify-center border border-gray-300 p-4 rounded-full hover:bg-gray-100 transition"
                    aria-label="Add to Favorites"
                  >
                    <FaHeart className="text-gray-600 text-xl" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 border-b pb-4">
          Customer Reviews
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Display Existing Reviews */}
          <div className="space-y-6">
            {product.reviews.length === 0 && (
              <p className="text-gray-600">
                No reviews yet. Be the first to share your thoughts!
              </p>
            )}
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 border rounded-md bg-gray-50"
              >
                <p className="font-bold">{review.name}</p>
                <div className="flex items-center my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        review.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
          {/* Write a Review Form */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Write your review</h3>
            {userInfo ? (
              <form
                onSubmit={submitReviewHandler}
                className="space-y-4 bg-white p-6 rounded-lg shadow-md"
              >
                <div>
                  <label className="font-semibold">Rating</label>
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer text-3xl ${
                          rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="font-semibold">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full mt-2 p-3 border rounded-md focus:ring-2 focus:ring-[#BFA181] focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingReview}
                  className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition flex justify-center items-center"
                >
                  {loadingReview ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            ) : (
              <p className="text-gray-600 p-6 bg-gray-100 rounded-md">
                Please{" "}
                <Link
                  to="/login"
                  className="text-[#BFA181] font-semibold hover:underline"
                >
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
