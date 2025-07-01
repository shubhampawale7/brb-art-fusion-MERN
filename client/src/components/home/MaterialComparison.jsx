import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactCompareSlider } from "react-compare-slider";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// --- Custom Handle with Responsive Sizing ---
// The handle is smaller on mobile screens for a less intrusive feel.
const CustomSliderHandle = () => (
  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg grid place-items-center text-gray-700 pointer-events-auto">
    <div className="flex text-md sm:text-lg">
      <FaChevronLeft />
      <FaChevronRight />
    </div>
  </div>
);

const MaterialComparison = () => {
  return (
    <motion.section
      className="py-16 sm:py-20 bg-white" // A clean background for the section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          {/* Responsive font size for better mobile hierarchy */}
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800">
            A Tale of Two Metals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Experience the distinct beauty of our two signature materials, Kansa
            and Brass.
          </p>
        </div>

        <div className="rounded-lg shadow-xl overflow-hidden">
          {/* Using aspect ratio for better responsive scaling */}
          <div className="aspect-[4/3] md:aspect-[16/9]">
            <ReactCompareSlider
              handle={<CustomSliderHandle />}
              itemOne={
                <Link
                  to="/shop/category/Bronze"
                  className="block h-full pointer-events-auto"
                  aria-label="Shop Kansa products"
                >
                  <img
                    src="https://zishta.com/cdn/shop/articles/Bronze-Dining-Legacy-Exploring-the-Timeless-Traditions-of-Eating-in-Kansa-Utensils-Zishta-7960-212931.jpg?v=1724156038&width=1400"
                    alt="A collection of Kansa dining utensils"
                    // IMPORTANT FIX: 'object-cover' prevents image distortion
                    className="w-full h-full object-cover"
                  />
                </Link>
              }
              itemTwo={
                <Link
                  to="/shop/category/Brass"
                  className="block h-full pointer-events-auto"
                  aria-label="Shop Brass products"
                >
                  <img
                    src="https://codesustain.in/cdn/shop/files/handmade-brass-pital-cutlery-set-4-pcs-971.jpg?v=1721492125&width=1445"
                    alt="A collection of polished Brass dining utensils"
                    // IMPORTANT FIX: 'object-cover' prevents image distortion
                    className="w-full h-full object-cover"
                  />
                </Link>
              }
            />
          </div>
        </div>

        {/* --- Redesigned Description Section --- */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kansa Card */}
          <div className="bg-slate-50 p-6 rounded-lg text-left md:text-center">
            <h3 className="text-2xl font-serif font-bold text-gray-800">
              Dine-in Kansa
            </h3>
            <p className="text-gray-600 my-3">
              Experience wellness with our authentic, lustrous Kansa (Bronze)
              serveware.
            </p>
            {/* Redesigned Button for a clearer CTA */}
            <Link
              to="/shop/category/Bronze"
              className="inline-flex items-center gap-2 font-semibold text-brand-accent group"
            >
              <span>Shop Kansa</span>
              <FaChevronRight
                className="transition-transform duration-200 group-hover:translate-x-1"
                size={14}
              />
            </Link>
          </div>

          {/* Brass Card */}
          <div className="bg-slate-50 p-6 rounded-lg text-left md:text-center">
            <h3 className="text-2xl font-serif font-bold text-gray-800">
              Dine-in Brass
            </h3>
            <p className="text-gray-600 my-3">
              Add a touch of timeless elegance to your table with our polished
              Brass collection.
            </p>
            {/* Redesigned Button for a clearer CTA */}
            <Link
              to="/shop/category/Brass"
              className="inline-flex items-center gap-2 font-semibold text-brand-accent group"
            >
              <span>Shop Brass</span>
              <FaChevronRight
                className="transition-transform duration-200 group-hover:translate-x-1"
                size={14}
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MaterialComparison;
