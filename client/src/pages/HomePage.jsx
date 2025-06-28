import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import Slider from "react-slick";
import ParallaxTilt from "react-parallax-tilt";
import { FaArrowRight } from "react-icons/fa";

import API from "../services/api";
import { toast } from "sonner";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// A simple component for a product card
const ProductCard = ({ product }) => (
  <ParallaxTilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={false}>
    <div className="bg-white rounded-lg shadow-md overflow-hidden m-4 transform hover:-translate-y-2 transition-transform duration-300">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{product.name}</h3>
          <p className="text-xl text-[#BFA181] mt-2">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  </ParallaxTilt>
);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get("/products?limit=8"); // Assuming an API enhancement to limit products
        setFeaturedProducts(data);
      } catch (error) {
        toast.error("Could not load featured products.");
      }
    };
    fetchFeatured();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <Helmet>
        <title>BRB Art Fusion - Exquisite Brass Decor and Murtis</title>
        <meta
          name="description"
          content="Discover handcrafted brass murtis, lanterns, and decorative items. Timeless craftsmanship from BRB Art Fusion."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-white text-center overflow-hidden">
        <Parallax speed={-20} className="absolute inset-0 w-full h-full">
          {/* Replace with a high-quality image of brass products */}
          <img
            src="https://images.unsplash.com/photo-1615093952934-28312678c487?q=80&w=1974"
            alt="Brass craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </Parallax>
        <motion.div
          className="relative z-10 p-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
            Timeless Craftsmanship in Brass
          </h1>
          <p className="text-lg md:text-xl mt-4 max-w-2xl">
            Discover exquisite, handcrafted art that brings heritage and
            elegance to your home.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block bg-[#BFA181] text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition"
          >
            Shop The Collection
          </Link>
        </motion.div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Featured Products
          </h2>
          {featuredProducts.length > 0 ? (
            <Slider {...sliderSettings}>
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Slider>
          ) : (
            <p className="text-center">Loading products...</p>
          )}
        </div>
      </div>

      {/* Brand Story Snippet */}
      <div className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            The Heart of BRB Art Fusion
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            At BRB Art Fusion, we believe that every piece of art tells a story.
            Our journey began with a passion for preserving the ancient craft of
            brasswork, transforming raw metal into breathtaking murtis,
            intricate lanterns, and timeless decor. Each creation is a testament
            to the skill of our artisans and our commitment to quality.
          </p>
          <Link
            to="/about"
            className="font-semibold text-[#BFA181] hover:underline flex items-center"
          >
            Read Our Full Story <FaArrowRight className="ml-2" />
          </Link>
        </div>
        <div>
          {/* Replace with a picture of an artisan at work */}
          <img
            src="https://images.unsplash.com/photo-1581750242215-37655859e3b9?q=80&w=2070"
            alt="Artisan working on brass"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-[#FDFDFD]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Our Customers Say
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            {/* This can be converted to a slider later */}
            <p className="text-xl italic text-gray-700">
              "The brass murti I received is absolutely stunning. The
              craftsmanship is exceptional, and it has become the centerpiece of
              my home. Thank you, BRB Art Fusion!"
            </p>
            <p className="mt-4 font-semibold">- Priya S., Mumbai</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
