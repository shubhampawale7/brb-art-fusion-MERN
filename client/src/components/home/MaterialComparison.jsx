import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactCompareSlider } from "react-compare-slider";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Custom component for the slider handle
const CustomSliderHandle = () => (
  <div className="w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center text-text-primary pointer-events-auto">
    <div className="flex text-lg">
      <FaChevronLeft />
      <FaChevronRight />
    </div>
  </div>
);

const MaterialComparison = () => {
  return (
    <motion.section
      // Reduced vertical padding from py-20 to py-16
      className="py-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif">
            A Tale of Two Metals
          </h2>
          <p className="text-lg text-text-secondary mt-2 max-w-2xl mx-auto">
            Experience the distinct beauty of our two signature materials, Kansa
            and Brass.
          </p>
        </div>

        {/* This wrapper disables pointer events but re-enables them on the handle/links */}
        <div className="rounded-lg shadow-xl overflow-hidden pointer-events-none">
          {/* Added a fixed height to constrain the slider's size */}
          <div className="h-[350px] md:h-[500px]">
            <ReactCompareSlider
              handle={<CustomSliderHandle />}
              itemOne={
                <Link
                  to="/shop/category/Bronze"
                  className="block h-full pointer-events-auto"
                >
                  <img
                    src="https://zishta.com/cdn/shop/articles/Bronze-Dining-Legacy-Exploring-the-Timeless-Traditions-of-Eating-in-Kansa-Utensils-Zishta-7960-212931.jpg?v=1724156038&width=1400"
                    alt="Kansa products"
                    className="w-full h-full object-fit"
                  />
                </Link>
              }
              itemTwo={
                <Link
                  to="/shop/category/Brass"
                  className="block h-full pointer-events-auto"
                >
                  <img
                    src="https://codesustain.in/cdn/shop/files/handmade-brass-pital-cutlery-set-4-pcs-971.jpg?v=1721492125&width=1445"
                    alt="Brass products"
                    className="w-full h-full object-fit"
                  />
                </Link>
              }
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-center">
          <div className="flex-1">
            <h3 className="text-2xl font-serif font-bold">Dine-in Kansa</h3>
            <p className="text-text-secondary my-2">
              Experience wellness with our authentic, lustrous Kansa (Bronze)
              serveware.
            </p>
            <Link
              to="/shop/category/Bronze"
              className="font-semibold text-brand-accent hover:underline"
            >
              Shop Kansa
            </Link>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-serif font-bold">Dine-in Brass</h3>
            <p className="text-text-secondary my-2">
              Add a touch of timeless elegance to your table with our polished
              Brass collection.
            </p>
            <Link
              to="/shop/category/Brass"
              className="font-semibold text-brand-accent hover:underline"
            >
              Shop Brass
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MaterialComparison;
