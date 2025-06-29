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
import FavoriteButton from "../components/products/FavoriteButton";
import ProductCard from "../components/products/ProductCard";

// Import styles for libraries
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-photo-view/dist/react-photo-view.css";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: authState } = useContext(AuthContext);
  const { userInfo } = authState;

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const { data: productData } = await API.get(`/products/${productId}`);
      setProduct(productData);

      if (productData.category) {
        const { data: relatedData } = await API.get(`/products`, {
          params: { category: productData.category },
        });
        setRelatedProducts(
          relatedData.products
            .filter((p) => p._id !== productData._id)
            .slice(0, 8) // Get up to 8 related products
        );
      }
    } catch (error) {
      toast.error("Product not found or there was an error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [productId]);

  const addToCartHandler = () => {
    const existItem = cartState.cartItems.find((x) => x._id === product._id);
    const newQty = existItem ? existItem.qty + qty : qty;

    if (product.countInStock < newQty) {
      toast.error("Sorry, this product is out of stock");
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
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
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
      fetchProductData(); // Refetch product data to show the new review
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoadingReview(false);
      setRating(0);
      setComment("");
    }
  };

  const mainSliderSettings = {
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
          className="w-20 h-20 object-cover rounded-md border-2 border-transparent hover:border-brand-accent"
        />
      </div>
    ),
    dotsClass: "slick-dots slick-thumb",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#BFA181" size={50} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 font-serif text-2xl text-text-primary">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <PhotoProvider>
            <Slider {...mainSliderSettings}>
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="cursor-pointer outline-none focus:outline-none"
                >
                  <PhotoView src={image}>
                    <img
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-auto max-h-[550px] object-contain rounded-lg"
                    />
                  </PhotoView>
                </div>
              ))}
            </Slider>
          </PhotoProvider>

          <div className="flex flex-col space-y-5">
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

            <div className="border-t pt-4 space-y-6 text-text-secondary leading-relaxed">
              <p>{product.description}</p>
              <div>
                <h3 className="font-bold text-lg text-text-primary mb-2">
                  Artisan's Note
                </h3>
                <p>
                  This piece is a testament to the timeless art of brasswork,
                  brought to life by the skilled hands of our master artisans.
                  Each curve and detail is meticulously crafted, ensuring you
                  receive not just a product, but a piece of heritage.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary mb-2">
                  Details & Dimensions
                </h3>
                <ul className="list-disc list-inside space-y-1">
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
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary mb-2">
                  Care Instructions
                </h3>
                <p>
                  To maintain its lustrous finish, gently wipe with a soft, dry
                  cloth. Avoid contact with harsh chemicals or abrasives. A
                  natural patina may develop over time, adding to its unique
                  character.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t">
              <span className="font-semibold text-lg text-text-primary">
                Availability:
              </span>
              <span
                className={`font-semibold ${
                  product.countInStock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.countInStock > 0 ? `In Stock` : "Out of Stock"}
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
                <div className="flex items-center space-x-4">
                  <button
                    onClick={addToCartHandler}
                    className="flex-grow flex items-center justify-center bg-brand-accent text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                  >
                    <FaShoppingCart className="mr-3" /> Add to Cart
                  </button>
                  <div className="relative">
                    <FavoriteButton product={product} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-20 bg-page-bg mt-16 rounded-lg">
        <h2 className="text-4xl font-bold text-text-primary mb-8">
          Customer Reviews
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-text-primary">
              Write your review
            </h3>
            {userInfo ? (
              <form
                onSubmit={submitReviewHandler}
                className="space-y-4 bg-card-bg p-8 rounded-lg shadow-md"
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
              <div className="p-6 bg-card-bg rounded-md">
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
          <div className="space-y-6">
            {product.reviews.length === 0 && (
              <p className="text-text-secondary p-6 bg-card-bg rounded-md shadow-sm">
                No reviews yet. Be the first to share your thoughts!
              </p>
            )}
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="p-6 border rounded-md bg-card-bg shadow-sm"
              >
                <p className="font-bold text-lg text-text-primary">
                  {review.name}
                </p>
                <div className="flex items-center my-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        review.rating > i ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-text-secondary">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
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
