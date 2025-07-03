import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import {
  FiShoppingCart,
  FiStar, // For rating stars
  FiDollarSign, // For price
  FiBox, // For availability
  FiPlus, // For quantity increase
  FiMinus, // For quantity decrease
  FiHeart, // For FavoriteButton overlay
  FiArrowLeft, // Back to shop link
  // --- Icons specifically for InfoTabs (now nested) ---
  FiBookOpen, // For Description tab
  FiClipboard, // For Details tab
  FiMessageSquare, // For Reviews tab
  FiSend, // For submit review button
  FiEdit3, // For comment input
  FiUser, // For review author
  FiCalendar, // For review date
  FiMaximize, // CHANGED: Replaced FiRuler with FiMaximize for dimensions
  FiHardDrive, // For weight
  FiTag, // For category in InfoTabs
} from "react-icons/fi"; // Feather Icons

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import FavoriteButton from "../components/products/FavoriteButton";
import ProductCard from "../components/products/ProductCard";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton"; // Import skeleton
import Slider from "react-slick"; // Carousel for related products

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- InfoTabs Component (Defined directly within this file) ---
const InfoTabs = ({
  product,
  userInfo,
  submitReviewHandler,
  rating,
  setRating,
  comment,
  setComment,
  loadingReview,
}) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabClass =
    "py-3 px-6 text-lg font-semibold transition-colors duration-300 relative group flex items-center justify-center";
  const activeTabClass = "text-brb-primary";
  const inactiveTabClass = "text-gray-600 hover:text-gray-900";

  const contentFadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full mt-16 bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav
          className="flex space-x-2 sm:space-x-4 md:space-x-8 -mb-px"
          aria-label="Tabs"
        >
          {[
            { id: "description", label: "Description", icon: FiBookOpen },
            { id: "details", label: "Details", icon: FiClipboard },
            {
              id: "reviews",
              label: `Reviews (${product.numReviews})`,
              icon: FiMessageSquare,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${tabClass} ${
                activeTab === tab.id ? activeTabClass : inactiveTabClass
              }`}
            >
              <span className="flex items-center">
                <tab.icon className="mr-2 text-xl" /> {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-brb-primary rounded-t-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Display Area */}
      <AnimatePresence mode="wait">
        {activeTab === "description" && (
          <motion.div
            key="description"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFadeVariants}
            className="prose max-w-none text-gray-700 leading-relaxed"
          >
            <h3 className="font-bold text-2xl text-gray-900 mb-4">
              Artisan's Note
            </h3>
            <p className="mb-4">{product.description}</p>
            <p>
              This piece is a testament to the timeless art of brasswork,
              brought to life by the skilled hands of our master artisans. Each
              curve and detail is meticulously crafted, ensuring you receive not
              just a product, but a piece of heritage.
            </p>
          </motion.div>
        )}
        {activeTab === "details" && (
          <motion.div
            key="details"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFadeVariants}
            className="prose max-w-none text-gray-700 leading-relaxed"
          >
            <h3 className="font-bold text-2xl text-gray-900 mb-4">
              Details & Dimensions
            </h3>
            <ul className="list-none space-y-3 pl-0">
              <li className="flex items-center text-base">
                <FiTag className="mr-3 text-brb-primary text-xl flex-shrink-0" />
                <strong>Category:</strong>{" "}
                <span className="ml-2 font-medium">
                  {product.category || "N/A"}
                </span>
              </li>
              <li className="flex items-center text-base">
                <FiStar className="mr-3 text-brb-primary text-xl flex-shrink-0" />
                <strong>Material:</strong>{" "}
                <span className="ml-2 font-medium">
                  {product.material || "N/A"}
                </span>
              </li>
              <li className="flex items-center text-base">
                <FiMaximize className="mr-3 text-brb-primary text-xl flex-shrink-0" />{" "}
                {/* CHANGED ICON HERE */}
                <strong>Dimensions:</strong>{" "}
                <span className="ml-2 font-medium">
                  {product.dimensions || "N/A"}
                </span>
              </li>
              <li className="flex items-center text-base">
                <FiHardDrive className="mr-3 text-brb-primary text-xl flex-shrink-0" />
                <strong>Weight:</strong>{" "}
                <span className="ml-2 font-medium">
                  {product.weight || "N/A"}
                </span>
              </li>
            </ul>
            <h3 className="font-bold text-2xl text-gray-900 mt-8 mb-4">
              Care Instructions
            </h3>
            <p>
              To maintain its lustrous finish, gently wipe with a soft, dry
              cloth. Avoid contact with harsh chemicals or abrasives. A natural
              patina may develop over time, adding to its unique character.
            </p>
          </motion.div>
        )}
        {activeTab === "reviews" && (
          <motion.div
            key="reviews"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentFadeVariants}
            className="grid md:grid-cols-2 gap-8 md:gap-12"
          >
            {/* Display Reviews */}
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600 text-lg border border-gray-100">
                  <FiMessageSquare className="mx-auto text-5xl text-gray-400 mb-3" />
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-6 bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-xl text-gray-900 flex items-center">
                        <FiUser className="mr-2 text-brb-primary" />{" "}
                        {review.name}
                      </p>
                      <span className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="mr-1" />{" "}
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            review.rating > i
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Write a Review
              </h3>
              {userInfo ? (
                <form
                  onSubmit={submitReviewHandler}
                  className="space-y-5 bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <div>
                    <label className="block font-semibold text-gray-800 mb-2">
                      Your Rating
                    </label>
                    <div className="flex space-x-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`cursor-pointer text-3xl transition-colors ${
                            rating > i ? "text-yellow-500" : "text-gray-300"
                          }`}
                          onClick={() => setRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="block font-semibold text-gray-800 mb-2"
                    >
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800 resize-y bg-gray-50"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingReview}
                    className="w-full bg-brb-primary text-white py-3 rounded-lg hover:bg-brb-primary-dark transition-colors flex justify-center items-center font-semibold text-lg shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loadingReview ? (
                      <ClipLoader size={24} color="white" />
                    ) : (
                      <>
                        <FiSend className="mr-2" /> Submit Review
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 text-center">
                  <p className="text-gray-600 text-base">
                    Please{" "}
                    <Link
                      to="/login"
                      className="text-brb-primary font-semibold hover:underline"
                    >
                      sign in
                    </Link>{" "}
                    to write a review.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- ProductDetailPage Component ---
const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0); // For user review input
  const [comment, setComment] = useState(""); // For user review input
  const [loadingReview, setLoadingReview] = useState(false); // For review submission loading
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0); // For main image gallery

  const { dispatch: cartDispatch } = useContext(CartContext);
  const { state: authState } = useContext(AuthContext);
  const { userInfo } = authState;

  // Helper to format price safely
  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : "0.00";

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const { data: productData } = await API.get(`/products/${productId}`);
      setProduct(productData);
      setActiveImage(0); // Reset active image on new product load

      // Fetch related products based on category
      if (productData.category) {
        const { data: relatedData } = await API.get(`/products`, {
          params: { category: productData.category, limit: 10 }, // Fetch more than needed
        });
        setRelatedProducts(
          relatedData.products
            .filter((p) => p._id !== productData._id) // Exclude current product
            .slice(0, 8) // Limit to 8 related products
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Product not found.");
      setProduct(null); // Set product to null on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on product ID change
    fetchProductData();
  }, [productId]);

  const addToCartHandler = () => {
    if (product.countInStock < qty) {
      toast.error(
        "Sorry, product is out of stock or quantity exceeds available stock."
      );
      return;
    }
    cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty } });
    toast.success(`${qty} x "${product.name}" added to cart!`);
    cartDispatch({ type: "OPEN_CART" }); // Assuming this opens a cart drawer
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    setLoadingReview(true);
    try {
      await API.post(
        `/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success(
        "Review submitted successfully! Thank you for your feedback."
      );
      // Re-fetch product data to update reviews section
      fetchProductData(); // This will re-trigger the whole product fetch
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoadingReview(false);
      setRating(0); // Clear form
      setComment(""); // Clear form
    }
  };

  // Slider settings for Related Products
  const relatedSliderSettings = {
    dots: true,
    infinite: relatedProducts.length > 4, // Only infinite if more items than slidesToShow
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Auto-play the slider
    autoplaySpeed: 3000, // Change slide every 3 seconds
    arrows: false, // Hide default arrows (can add custom ones)
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // --- Render Loading State ---
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <ClipLoader color="#BFA181" size={70} />
      </div>
    );

  // --- Render Product Not Found State ---
  if (!product)
    return (
      <div className="text-center py-16 text-gray-700 text-3xl font-semibold bg-gray-50 min-h-screen">
        Product Not Found.
      </div>
    );

  const isOutOfStock = product.countInStock === 0;

  return (
    <>
      <Helmet>
        <title>{`${product.name} - BRB Art Fusion`}</title>
        <meta
          name="description"
          content={product.description.substring(0, 160)}
        />
        {/* Schema Markup for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images[0],
            description: product.description,
            sku: product._id,
            brand: { "@type": "Brand", name: "BRB Art Fusion" },
            offers: {
              "@type": "Offer",
              url: window.location.href,
              priceCurrency: "INR",
              price: product.price,
              availability:
                product.countInStock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              priceValidUntil: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ).toISOString(),
            },
            aggregateRating:
              product.numReviews > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: product.rating,
                    reviewCount: product.numReviews,
                  }
                : undefined, // Only include if reviews exist
          })}
        </script>
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8 md:py-12 lg:py-16">
        {" "}
        {/* Soft background, generous padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/shop"
            className="inline-flex items-center text-brb-primary hover:text-brb-primary-dark transition-colors duration-200 mb-6 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-100">
            {/* Left Column: Product Images */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-4">
              {/* Image Thumbnails */}
              <div className="col-span-2 space-y-3 flex flex-col items-center">
                {" "}
                {/* Centered thumbnails */}
                {product.images.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-full aspect-square object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 shadow-sm
                      ${
                        activeImage === index
                          ? "border-brb-primary ring-2 ring-brb-primary-light"
                          : "border-gray-200 hover:border-brb-primary-dark"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
              {/* Main Image */}
              <div className="col-span-10 relative flex justify-center items-center">
                {" "}
                {/* Centered main image */}
                <motion.img
                  key={activeImage} // Key to trigger animation on image change
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-xl" // Max height for large image
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                {/* Favorite Button */}
                <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton product={product} />
                </div>
                {/* Out of Stock Badge */}
                {isOutOfStock && (
                  <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10 tracking-wide uppercase">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Product Details & Actions */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-5 lg:space-y-6">
                {" "}
                {/* Increased spacing */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  {" "}
                  {/* Larger, bolder heading */}
                  {product.name}
                </h1>
                {/* Rating */}
                <div className="flex items-center space-x-2 text-yellow-500">
                  {" "}
                  {/* Branded yellow stars */}
                  <div className="flex items-center">
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
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({product.numReviews} reviews)
                  </span>
                </div>
                {/* Price */}
                <p className="text-4xl md:text-5xl font-extrabold text-brb-primary mb-4">
                  {" "}
                  {/* Larger, branded price */}₹{formatPrice(product.price)}
                </p>
                {/* Availability */}
                <div className="flex items-center space-x-2 pt-5 border-t border-gray-100">
                  {" "}
                  {/* Top border for separation */}
                  <span className="font-semibold text-lg text-gray-800">
                    Availability:
                  </span>
                  <span
                    className={`font-semibold text-lg ${
                      product.countInStock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.countInStock > 0
                      ? `In Stock (${product.countInStock} left)`
                      : "Out of Stock"}
                  </span>
                </div>
                {/* Quantity Selector & Add to Cart */}
                {product.countInStock > 0 && (
                  <div className="flex flex-col space-y-4 pt-2">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-lg text-gray-800">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
                        <button
                          onClick={() =>
                            setQty((prev) => Math.max(1, prev - 1))
                          }
                          className="px-4 py-2 text-xl hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={qty <= 1}
                        >
                          <FiMinus />
                        </button>
                        <span className="px-6 py-2 text-xl font-bold text-gray-800">
                          {qty}
                        </span>
                        <button
                          disabled={qty >= product.countInStock}
                          onClick={() => setQty((prev) => prev + 1)}
                          className="px-4 py-2 text-xl hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={addToCartHandler}
                      className="w-full flex items-center justify-center bg-brb-primary text-white px-8 py-3.5 rounded-lg hover:bg-brb-primary-dark transition-colors text-lg font-semibold shadow-md"
                    >
                      <FiShoppingCart className="mr-3 text-xl" /> Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Tabs Component */}
          {/* InfoTabs is defined internally in this file */}
          <InfoTabs
            product={product}
            userInfo={userInfo}
            submitReviewHandler={submitReviewHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            loadingReview={loadingReview}
          />
        </div>
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="bg-white py-12 md:py-16 lg:py-20 mt-16 rounded-xl shadow-lg border border-gray-100 container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10">
              You Might Also Like
            </h2>
            <Slider {...relatedSliderSettings}>
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="px-3">
                  {" "}
                  {/* Add padding for card spacing in slider */}
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </Slider>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;
