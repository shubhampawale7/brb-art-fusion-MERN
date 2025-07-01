import Slider from "react-slick";
import ProductCard from "../products/ProductCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

// --- Custom Arrow Components (Styled for the new layout) ---

const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition"
    onClick={onClick}
    aria-label="Next"
  >
    <FiChevronRight size={20} className="text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition"
    onClick={onClick}
    aria-label="Previous"
  >
    <FiChevronLeft size={20} className="text-gray-700" />
  </button>
);

// --- Main FeaturedProducts Component ---

const FeaturedProducts = ({ products }) => {
  // We need at least 3 products for this layout to look best.
  // One for the main feature, and at least two for the slider.
  if (!products || products.length < 3) {
    return null; // Or return a simpler layout
  }

  // The first product is the main "Hero" product
  const heroProduct = products[0];
  // The rest are for the slider
  const sliderProducts = products.slice(1);

  const sliderSettings = {
    dots: false, // This design looks cleaner without dots
    infinite: sliderProducts.length > 2,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    lazyLoad: "ondemand",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      // On mobile, the slider shows one product at a time
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Main grid for the new editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center">
          {/* LEFT COLUMN: The Hero Product */}
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* The ProductCard naturally fills the space */}
            <ProductCard product={heroProduct} />
          </motion.div>

          {/* RIGHT COLUMN: Text content and the smaller carousel */}
          <motion.div
            className="pt-12 lg:pt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
          >
            <div className="lg:max-w-md">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
                Works of the Month
              </h2>
              <p className="text-lg text-gray-600 mt-4 mb-8">
                A curated selection of our most beloved pieces, celebrated for
                their exceptional beauty and craftsmanship.
              </p>
            </div>

            <div className="relative">
              <Slider {...sliderSettings}>
                {sliderProducts.map((product) => (
                  <div key={product._id} className="px-2">
                    <ProductCard product={product} />
                  </div>
                ))}
              </Slider>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
