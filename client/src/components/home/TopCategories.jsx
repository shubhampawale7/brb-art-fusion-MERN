import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import API from "../../services/api";

// --- Icon Imports ---
import {
  FiGrid,
  FiChevronRight,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";

// --- Data & Helpers ---
// For better organization, constants and helpers are grouped.
const CATEGORY_IMAGES = {
  "Brass Murtis":
    "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751297529/brb-art-fusion/di8ba1jhuq3htttdiom3.jpg",
  "Pooja Items":
    "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751297327/brb-art-fusion/n1gxjwqbinmelve2nsvb.jpg",
  Kitchenware:
    "https://plus.unsplash.com/premium_photo-1664391918718-e30f547f87de?q=80&w=1054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Decorative Items":
    "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751296602/brb-art-fusion/vkwhlhp85lkgymbp2gev.jpg",
  Lanterns:
    "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751296732/brb-art-fusion/jgivspzhfntgyjhriszy.jpg",
  fallback:
    "https://res.cloudinary.com/dfrjloqgb/image/upload/v1700000000/brb-art-fusion/category_fallback.jpg",
};

const getCategoryImage = (categoryName) =>
  CATEGORY_IMAGES[categoryName] || CATEGORY_IMAGES.fallback;
const PLACEHOLDER_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// --- Custom Hook for Data Fetching ---
// Encapsulates the logic for fetching and filtering categories.
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/products/categories");
        const filtered = data.filter(
          (cat) => !["Wall Decor", "Drinkware", "Gifting"].includes(cat)
        );
        setCategories(filtered.slice(0, 5)); // Fetches 5 to leave space for a "View All" card
      } catch (err) {
        console.error("Failed to load categories", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// --- Animation Variants ---
// Centralized variants for consistency and easier management.
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- Child Components ---

const CategoryCard = ({ category }) => (
  <motion.div
    variants={itemVariants}
    className="group relative block aspect-square"
  >
    <Link
      to={`/shop/category/${encodeURIComponent(category)}`}
      className="block h-full w-full"
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl shadow-lg border border-gray-100">
        <LazyLoadImage
          alt={category}
          src={getCategoryImage(category)}
          effect="blur"
          placeholderSrc={PLACEHOLDER_IMAGE}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
          <motion.h3
            initial={{ y: 0 }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-white text-2xl md:text-3xl font-extrabold"
          >
            {category}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="mt-2"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brb-primary text-white rounded-lg font-semibold text-sm">
              Shop Now <FiChevronRight />
            </span>
          </motion.div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ViewAllCard = () => (
  <motion.div
    variants={itemVariants}
    className="flex h-full min-h-[250px] md:min-h-full"
  >
    <Link
      to="/shop"
      className="group flex flex-grow flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-center transition-colors hover:border-brb-primary hover:bg-brb-primary/5"
    >
      <FiShoppingBag className="mb-4 text-5xl text-gray-400 transition-colors group-hover:text-brb-primary" />
      <h3 className="text-2xl font-bold text-gray-800">View All</h3>
      <p className="mb-4 text-gray-600">Explore our complete range.</p>
      <span className="inline-flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold text-base transition-colors group-hover:bg-brb-primary group-hover:text-white">
        Shop All <FiArrowRight />
      </span>
    </Link>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="aspect-square animate-pulse rounded-xl bg-gray-200 shadow-lg">
    <div className="absolute bottom-0 left-0 p-4 w-full">
      <div className="mb-2 h-6 w-3/4 rounded bg-gray-300"></div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full mx-auto max-w-md rounded-xl border border-gray-100 bg-white p-10 text-center shadow-lg">
    <FiGrid className="mx-auto mb-6 text-7xl text-gray-400" />
    <h3 className="mb-3 text-2xl font-bold text-gray-800">
      No Categories Found
    </h3>
    <p className="text-lg text-gray-600">
      It seems there are no product categories available right now. Please check
      back later!
    </p>
  </div>
);

// --- Main Component ---

const TopCategories = () => {
  const { categories, loading, error } = useCategories();

  return (
    <section className="bg-gray-50 py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 flex items-center justify-center font-serif text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            <FiGrid className="mr-4 inline-block text-4xl text-brb-primary md:text-5xl" />
            Shop By Category
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
            Discover our curated collections by Browse through distinct
            categories of brass art.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {loading ? (
              [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
            ) : error || categories.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {categories.map((category) => (
                  <CategoryCard key={category} category={category} />
                ))}
                <ViewAllCard />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default TopCategories;
