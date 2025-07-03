import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Icon Imports
import {
  FiGrid,
  FiChevronRight,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";

// Helper function to map category names to specific images
const getCategoryImage = (categoryName) => {
  const images = {
    "Brass Murtis":
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751297529/brb-art-fusion/di8ba1jhuq3htttdiom3.jpg",
    "Pooja Items":
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751297327/brb-art-fusion/n1gxjwqbinmelve2nsvb.jpg",

    Kitchenware:
      "https://plus.unsplash.com/premium_photo-1664391918718-e30f547f87de?q=80&w=1054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Using a consistent Cloudinary placeholder
    "Decorative Items":
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751296602/brb-art-fusion/vkwhlhp85lkgymbp2gev.jpg",
    Lanterns:
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751296732/brb-art-fusion/jgivspzhfntgyjhriszy.jpg",
  };
  // Fallback to a generic Cloudinary placeholder if categoryName is not in the map
  return (
    images[categoryName] ||
    "https://res.cloudinary.com/dfrjloqgb/image/upload/v1700000000/brb-art-fusion/category_fallback.jpg"
  );
};

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// --- CategoryCard Component ---
const CategoryCard = ({ category, index }) => {
  // Framer Motion variants for card entry
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Starts smaller, lower, and hidden
    visible: { opacity: 1, scale: 1, y: 0 }, // Scales up, slides up, fades in
  };

  return (
    <motion.div
      // *** MODIFIED: Use max-w and flex-basis to control item width, allowing flex-wrap to center ***
      className="group relative block flex-shrink-0 flex-grow-0 basis-[calc(50%-theme(gap.4))] sm:basis-[calc(33.333%-theme(gap.6))] lg:basis-[calc(33.333%-theme(gap.8))] xl:basis-[calc(16.666%-theme(gap.8))]" /* Adjusted basis for exact width + responsive gap handling */
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover="hovered"
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }} // Moved transition to the main motion.div
    >
      <Link
        to={`/shop/category/${encodeURIComponent(category)}`}
        className="block h-full"
      >
        <div className="relative overflow-hidden rounded-xl shadow-lg aspect-square border border-gray-100 h-full">
          {/* Image - scales and desaturates slightly on hover */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1, filter: "grayscale(0%)" }}
            variants={{ hovered: { scale: 1.1, filter: "grayscale(20%)" } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LazyLoadImage
              alt={category}
              src={getCategoryImage(category)}
              effect="blur" // Lazy load with blur effect
              placeholderSrc={placeholderImage}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Overlay - fades in on hover */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end p-4 md:p-6"
            initial={{ opacity: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
            variants={{
              hovered: { opacity: 1, backgroundColor: "rgba(0,0,0,0.5)" },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Category Name - moves up and becomes brighter on hover */}
            <motion.h3
              className="text-white text-2xl md:text-3xl font-extrabold leading-tight"
              initial={{ y: 0, color: "white" }}
              variants={{ hovered: { y: -10, color: "#BFA181" } }} // Moves up, changes color to brand accent
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {category}
            </motion.h3>

            {/* Shop Now Button - fades in and slides up on hover */}
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 20 }}
              variants={{ hovered: { opacity: 1, y: 0 } }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            >
              <span className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brb-primary text-white rounded-lg font-semibold text-sm shadow-md">
                Shop Now <FiChevronRight className="text-lg" />
              </span>
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true); // Set loading true before fetch
      try {
        const { data } = await API.get("/products/categories");
        const filteredCategories = data.filter(
          (cat) => !["Wall Decor", "Drinkware", "Gifting"].includes(cat)
        );
        setCategories(filteredCategories.slice(0, 6)); // Take the first 6 of the filtered categories
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false); // Set loading false after fetch
      }
    };
    fetchCategories();
  }, []);

  // Framer Motion variants for the section header
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Framer Motion variants for the grid container (for staggering children)
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Faster stagger animation for individual cards
      },
    },
  };

  return (
    <motion.section
      className="py-16 md:py-20 lg:py-24 bg-gray-50" // Consistent background and padding
      initial="hidden" // Section starts hidden
      whileInView="visible" // Animates when in viewport
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of section is visible, only once
      variants={gridContainerVariants} // Apply grid animation variants (will also apply to children)
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-gray-900 mb-4 leading-tight flex items-center justify-center">
            <FiGrid className="inline-block mr-4 text-brb-primary text-4xl md:text-5xl" />
            Shop By Category
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections by Browse through distinct
            categories of brass art.
          </p>
        </motion.div>

        {/* Categories Grid Container - NOW FLEX LAYOUT FOR CENTERING */}
        {/* This flex container now explicitly controls spacing and centering of items */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
          {loading ? (
            // Skeletons also need the responsive width (same as CategoryCard)
            <>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl bg-gray-200 animate-pulse shadow-lg 
                             flex-shrink-0 flex-grow-0 basis-[calc(50%-theme(gap.4))] sm:basis-[calc(33.333%-theme(gap.6))] lg:basis-[calc(33.333%-theme(gap.8))] xl:basis-[calc(16.666%-theme(gap.8))]" /* Responsive widths */
                >
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  </div>
                </div>
              ))}
            </>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-md mx-auto">
              <FiGrid className="mx-auto text-7xl text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Categories Found
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                It seems there are no product categories available right now.
                Please check back later!
              </p>
            </div>
          ) : (
            <>
              {categories.map((category, index) => (
                <CategoryCard
                  key={category}
                  category={category}
                  index={index}
                />
              ))}
              {/* Static "View All" Card (optional) */}
              {/* This also needs responsive width like other cards and is a flex item */}
              <motion.div
                className="hidden lg:flex bg-white rounded-xl shadow-lg border border-gray-100 flex-col items-center justify-center p-6 text-center group
                           flex-shrink-0 flex-grow-0 basis-[calc(50%-theme(gap.4))] sm:basis-[calc(33.333%-theme(gap.6))] lg:basis-[calc(33.333%-theme(gap.8))] xl:basis-[calc(16.666%-theme(gap.8))]" /* Responsive widths */
                variants={
                  headerVariants
                } /* Reusing header variants for single entry */
              >
                <FiShoppingBag className="text-6xl text-gray-400 mb-4 group-hover:text-brb-primary transition-colors" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  View All
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore our complete range of products.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-brb-primary text-white rounded-lg font-semibold text-base hover:bg-brb-primary-dark transition-colors shadow-md"
                >
                  Shop All <FiArrowRight />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default TopCategories;
