import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { FaShoppingCart, FaStar } from "react-icons/fa";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import FavoriteButton from "../components/products/FavoriteButton";
import ProductCard from "../components/products/ProductCard";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    "py-3 px-1 font-semibold transition-colors duration-300 border-b-2";
  const activeTabClass = "border-brand-accent text-brand-accent";
  const inactiveTabClass =
    "border-transparent text-text-secondary hover:text-text-primary";

  return (
    <div className="w-full mt-16">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("description")}
            className={`${tabClass} ${
              activeTab === "description" ? activeTabClass : inactiveTabClass
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`${tabClass} ${
              activeTab === "details" ? activeTabClass : inactiveTabClass
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`${tabClass} ${
              activeTab === "reviews" ? activeTabClass : inactiveTabClass
            }`}
          >
            Reviews ({product.numReviews})
          </button>
        </nav>
      </div>
      <div className="py-8">
        {activeTab === "description" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose max-w-none text-text-secondary"
          >
            <h3 className="font-bold text-xl text-text-primary mb-2">
              Artisan's Note
            </h3>
            <p>{product.description}</p>
            <p className="mt-4">
              This piece is a testament to the timeless art of brasswork,
              brought to life by the skilled hands of our master artisans. Each
              curve and detail is meticulously crafted, ensuring you receive not
              just a product, but a piece of heritage.
            </p>
          </motion.div>
        )}
        {activeTab === "details" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose max-w-none text-text-secondary"
          >
            <h3 className="font-bold text-xl text-text-primary mb-2">
              Details & Dimensions
            </h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>Material:</strong> {product.material}
              </li>
              <li>
                <strong>Dimensions:</strong> {product.dimensions || "N/A"}
              </li>
              <li>
                <strong>Weight:</strong> {product.weight || "N/A"}
              </li>
            </ul>
            <h3 className="font-bold text-xl text-text-primary mt-6 mb-2">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <p className="text-text-secondary p-6 bg-page-bg rounded-md">
                  No reviews yet.
                </p>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-4 border rounded-md bg-page-bg"
                  >
                    <p className="font-bold text-lg text-text-primary">
                      {review.name}
                    </p>
                    <div className="flex items-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            review.rating > i
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mb-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-text-secondary">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-text-primary">
                Write a review
              </h3>
              {userInfo ? (
                <form
                  onSubmit={submitReviewHandler}
                  className="space-y-4 bg-white p-6 rounded-lg shadow-md"
                >
                  <div>
                    <label className="font-semibold text-text-primary">
                      Your Rating
                    </label>
                    <div className="flex space-x-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`cursor-pointer text-3xl transition-colors ${
                            rating > i ? "text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => setRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="font-semibold text-text-primary"
                    >
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      className="w-full mt-2 p-3 border rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition text-text-primary bg-page-bg"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingReview}
                    className="w-full bg-text-primary text-white py-3 rounded-md hover:bg-opacity-90 transition flex justify-center items-center font-semibold"
                  >
                    {loadingReview ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-white rounded-md">
                  <p className="text-text-secondary">
                    Please{" "}
                    <Link
                      to="/login"
                      className="text-brand-accent font-semibold hover:underline"
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
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: authState } = useContext(AuthContext);
  const { userInfo } = authState;

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const { data: productData } = await API.get(`/products/${productId}`);
      setProduct(productData);
      setActiveImage(0);

      if (productData.category) {
        const { data: relatedData } = await API.get(`/products`, {
          params: { category: productData.category },
        });
        setRelatedProducts(
          relatedData.products
            .filter((p) => p._id !== productData._id)
            .slice(0, 8)
        );
      }
    } catch (error) {
      toast.error("Product not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [productId]);

  const addToCartHandler = () => {
    if (product.countInStock < qty) {
      toast.error("Sorry, product is out of stock");
      return;
    }
    cartDispatch({ type: "ADD_TO_CART", payload: { ...product, qty } });
    toast.success(`${qty} x ${product.name} added to cart!`);
    cartDispatch({ type: "OPEN_CART" });
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
      toast.success("Review submitted successfully!");
      fetchProductData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoadingReview(false);
      setRating(0);
      setComment("");
    }
  };

  const relatedSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#BFA181" size={50} />
      </div>
    );
  if (!product)
    return (
      <div className="text-center py-10 font-serif text-2xl text-text-primary">
        Product Not Found.
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{`${product.name} - BRB Art Fusion`}</title>
        <meta
          name="description"
          content={product.description.substring(0, 160)}
        />
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
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.numReviews,
            },
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 grid grid-cols-12 gap-4">
            <div className="col-span-2 space-y-3">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  onClick={() => setActiveImage(index)}
                  className={`w-full aspect-square object-cover rounded-md cursor-pointer border-2 ${
                    activeImage === index
                      ? "border-brand-accent"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="col-span-10 relative">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
              <div className="absolute top-4 right-4">
                <FavoriteButton product={product} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-5">
              <h1 className="text-5xl font-bold font-serif text-text-primary">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        product.rating > i ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-text-secondary">
                  ({product.numReviews} reviews)
                </span>
              </div>
              <p className="text-4xl font-sans font-bold text-brand-accent">
                ₹{product.price.toFixed(2)}
              </p>
              <div className="flex items-center space-x-2 pt-5 border-t">
                <span className="font-semibold text-lg text-text-primary">
                  Availability:
                </span>
                <span
                  className={`font-semibold ${
                    product.countInStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.countInStock > 0
                    ? `In Stock (${product.countInStock} left)`
                    : "Out of Stock"}
                </span>
              </div>
              {product.countInStock > 0 && (
                <div className="flex flex-col space-y-4 pt-2">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-lg text-text-primary">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                        className="px-4 py-2 hover:bg-page-bg transition"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 font-bold text-lg">{qty}</span>
                      <button
                        disabled={qty >= product.countInStock}
                        onClick={() => setQty((prev) => prev + 1)}
                        className="px-4 py-2 hover:bg-page-bg transition disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={addToCartHandler}
                    className="w-full flex items-center justify-center bg-brand-accent text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                  >
                    <FaShoppingCart className="mr-3" /> Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

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

      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-10">
            You Might Also Like
          </h2>
          <Slider {...relatedSliderSettings}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </Slider>
        </section>
      )}
    </>
  );
};

export default ProductDetailPage;
