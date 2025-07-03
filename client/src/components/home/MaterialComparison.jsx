import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactCompareSlider } from "react-compare-slider";
// Importing Feather Icons for consistency (replacing FaChevronLeft/Right)
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

// --- Custom Handle with Responsive Sizing ---
const CustomSliderHandle = () => (
  // Enhanced styling for the handle itself
  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg grid place-items-center text-gray-700 pointer-events-auto transition-all duration-200 group-hover:scale-110">
    <div className="flex text-lg sm:text-xl">
      {" "}
      {/* Larger, modern Feather Icons for arrows */}
      <FiChevronLeft />
      <FiChevronRight />
    </div>
  </div>
);

const MaterialComparison = () => {
  // Framer Motion variants for section entry (fade in and slide up)
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Framer Motion variants for text content in header (staggered fade in)
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Framer Motion variants for the material description cards (staggered scale/fade)
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 }, // Starts slightly smaller and hidden
    visible: (i) => ({
      // Uses custom prop 'i' for staggered delay
      opacity: 1,
      scale: 1, // Scales up to full size
      transition: {
        delay: i * 0.2, // Stagger delay (0.2s between cards)
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      className="py-16 md:py-20 lg:py-24 bg-gray-50" // Lighter background, more generous vertical padding
      initial="hidden" // Section starts hidden
      whileInView="visible" // Animates when in viewport
      viewport={{ once: true, amount: 0.2 }} // Triggers when 20% of section is visible, only once
      variants={sectionVariants} // Apply section entry animation
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Responsive padding for container */}
        {/* Header Section */}
        <motion.div
          variants={textVariants}
          className="text-center mb-12 md:mb-16"
        >
          {" "}
          {/* Increased bottom margin */}
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-gray-900 mb-3 leading-tight">
            A Tale of Two Metals
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mt-3 max-w-3xl mx-auto">
            Experience the distinct beauty and unique characteristics of our
            signature materials: the traditional **Kansa (Bronze)** and the
            timeless **Brass**.
          </p>
        </motion.div>
        {/* Image Comparison Slider */}
        <motion.div
          variants={sectionVariants}
          className="rounded-xl shadow-2xl overflow-hidden border border-gray-100 relative group"
        >
          {" "}
          {/* Stronger shadow, softer rounded corners, group for handle hover */}
          <div className="aspect-[4/3] md:aspect-[16/9] w-full">
            {" "}
            {/* Responsive aspect ratio container */}
            <ReactCompareSlider
              handle={<CustomSliderHandle />} // Custom handle component
              itemOne={
                <Link
                  to="/shop/category/Bronze"
                  className="block h-full w-full pointer-events-auto relative" /* Added relative for label positioning */
                  aria-label="Shop Kansa products"
                  onClick={() =>
                    window.scrollTo(0, 0)
                  } /* Scrolls to top of next page on click */
                >
                  <img
                    src="https://zishta.com/cdn/shop/articles/Bronze-Dining-Legacy-Exploring-the-Timeless-Traditions-of-Eating-in-Kansa-Utensils-Zishta-7960-212931.jpg?v=1724156038&width=1400"
                    alt="A collection of Kansa dining utensils"
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-102" /* Image zoom on hover */
                  />
                  {/* Label for Kansa */}
                  <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-md font-semibold text-sm tracking-wider">
                    KANSA (BRONZE)
                  </div>
                </Link>
              }
              itemTwo={
                <Link
                  to="/shop/category/Brass"
                  className="block h-full w-full pointer-events-auto relative" /* Added relative for label positioning */
                  aria-label="Shop Brass products"
                  onClick={() =>
                    window.scrollTo(0, 0)
                  } /* Scrolls to top of next page on click */
                >
                  <img
                    src="https://codesustain.in/cdn/shop/files/handmade-brass-pital-cutlery-set-4-pcs-971.jpg?v=1721492125&width=1445"
                    alt="A collection of polished Brass dining utensils"
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-102" /* Image zoom on hover */
                  />
                  {/* Label for Brass */}
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-md font-semibold text-sm tracking-wider">
                    BRASS
                  </div>
                </Link>
              }
            />
          </div>
        </motion.div>
        {/* --- Redesigned Description Section (Material Cards) --- */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Kansa Card */}
          <motion.div
            custom={0} /* Custom prop for staggered animation */
            variants={cardVariants} /* Apply card entry animation */
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center" /* Card styling */
          >
            <h3 className="text-3xl font-extrabold font-serif text-gray-900 mb-4">
              Dine-in Kansa
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-sm">
              Experience holistic wellness with our authentic, lustrous Kansa
              (Bronze) serveware, known for its therapeutic properties and
              antique appeal.
            </p>
            <Link
              to="/shop/category/Bronze"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-brb-primary text-white font-semibold text-lg hover:bg-brb-primary-dark transition-colors shadow-md"
              onClick={() =>
                window.scrollTo(0, 0)
              } /* Scrolls to top of next page on click */
            >
              <span>Shop Kansa</span>
              <FiArrowRight className="text-xl" /> {/* Arrow icon for CTA */}
            </Link>
          </motion.div>

          {/* Brass Card */}
          <motion.div
            custom={1} /* Custom prop for staggered animation */
            variants={cardVariants} /* Apply card entry animation */
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center" /* Card styling */
          >
            <h3 className="text-3xl font-extrabold font-serif text-gray-900 mb-4">
              Timeless Brass
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-sm">
              Adorn your space with our beautifully crafted Brass collection,
              celebrated for its radiant polish and versatile decorative
              presence.
            </p>
            <Link
              to="/shop/category/Brass"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-brb-primary text-white font-semibold text-lg hover:bg-brb-primary-dark transition-colors shadow-md"
              onClick={() =>
                window.scrollTo(0, 0)
              } /* Scrolls to top of next page on click */
            >
              <span>Shop Brass</span>
              <FiArrowRight className="text-xl" /> {/* Arrow icon for CTA */}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default MaterialComparison;
