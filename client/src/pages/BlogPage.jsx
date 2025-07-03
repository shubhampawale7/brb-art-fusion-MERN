import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../services/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { ClipLoader } from "react-spinners"; // For loading state
import { LazyLoadImage } from "react-lazy-load-image-component"; // For lazy loading images
import "react-lazy-load-image-component/src/effects/blur.css"; // Styles for blur effect

// Icon Imports
import {
  FiBookOpen,
  FiFeather,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi"; // Feather Icons

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// --- BlogCard Component (Defined directly within this file for convenience) ---
const BlogCard = ({ article, index }) => {
  // Framer Motion variants for card entry
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Starts hidden, off-bottom
    visible: {
      opacity: 1,
      y: 0, // Slides into view
      transition: {
        duration: 0.6,
        delay: index * 0.1, // Staggered delay for each card
        ease: "easeOut",
      },
    },
  };

  // Safe date formatting
  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A Date";
  // const authorName = article.author?.name || 'BRB Team'; // Uncomment if article data includes author

  return (
    <motion.div
      className="group block" // Use Tailwind's group class for hover effects on children
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      }} /* Subtle lift and stronger shadow on hover */
      transition={{ duration: 0.3, ease: "easeOut" }} // Smooth transition for hover effect
    >
      <Link to={`/blog/${article.slug}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {" "}
          {/* Card container styling */}
          {/* Article Featured Image */}
          <LazyLoadImage
            alt={article.title}
            src={article.featuredImage || placeholderImage}
            effect="blur" // Blur effect during lazy loading
            placeholderSrc={placeholderImage}
            className="w-full h-56 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" /* Image zoom on hover */
          />
          <div className="p-6">
            {/* Article Title */}
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight line-clamp-2 mb-3 group-hover:text-brb-primary transition-colors">
              {" "}
              {/* Larger, bolder title, clamps to 2 lines */}
              {article.title}
            </h3>
            {/* Meta Info: Date & Author (if applicable) */}
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <FiCalendar className="mr-2 text-base" /> {formattedDate}
              {/* Example for author: <span className="mx-2">•</span> <FiUser className="mr-1 text-base" /> {authorName} */}
            </div>
            {/* Article Excerpt */}
            <p className="text-gray-700 text-base leading-relaxed line-clamp-3 mb-4">
              {" "}
              {/* Enhanced excerpt styling, clamps to 3 lines */}
              {article.excerpt}
            </p>
            {/* Read More Link */}
            <span className="inline-flex items-center font-semibold text-brb-primary group-hover:underline transition-colors">
              Read More <FiChevronRight className="ml-1" />{" "}
              {/* Read More with right arrow icon */}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- BlogCardSkeleton Component (for loading state) ---
const BlogCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <div className="w-full h-56 bg-gray-200 animate-pulse"></div>{" "}
    {/* Image placeholder */}
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>{" "}
      {/* Title placeholder */}
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>{" "}
      {/* Meta placeholder */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>{" "}
      {/* Excerpt line 1 */}
      <div className="h-4 bg-gray-200 rounded w-11/12 mb-2 animate-pulse"></div>{" "}
      {/* Excerpt line 2 */}
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>{" "}
      {/* Excerpt line 3 */}
      <div className="mt-4 h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>{" "}
      {/* Read More placeholder */}
    </div>
  </div>
);

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const { data } = await API.get("/articles");
        setArticles(data);
      } catch (error) {
        toast.error("Failed to load articles."); // Show error toast on failure
      } finally {
        setLoading(false); // Set loading to false after fetch (success or failure)
      }
    };
    fetchArticles();
  }, []); // Empty dependency array means this effect runs once after initial render

  // Framer Motion variants for the main page header
  const pageHeaderVariants = {
    hidden: { opacity: 0, y: -20 }, // Starts hidden above, fades in
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    }, // Slides down, fades in
  };

  // Framer Motion variants for the article grid container (for staggering children)
  const articleGridVariants = {
    hidden: { opacity: 0 }, // Grid starts invisible
    visible: {
      opacity: 1, // Grid becomes visible
      transition: {
        staggerChildren: 0.1, // Each child (BlogCard) animates with a 0.1s delay after the previous one
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Inspire & Elevate - BRB Art Fusion</title>
        <meta
          name="description"
          content="Discover the story, mission, and craftsmanship behind BRB Art Fusion. A legacy of artistry in brass."
        />
      </Helmet>
      {/* Main page container with background and padding */}
      <div className="bg-gray-50 min-h-screen py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header / Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={pageHeaderVariants}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight flex items-center justify-center">
              <FiBookOpen className="inline-block mr-4 text-brb-primary text-4xl md:text-5xl lg:text-6xl" />{" "}
              {/* Branded icon */}
              Inspire & Elevate
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Dive into the world of brass art: stories, insights, and
              inspiration for your home and spirit.
            </p>
          </motion.div>

          {/* Article Grid / Loading / Empty States */}
          {loading ? (
            // Loading State: Displays BlogCard Skeletons
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map(
                (
                  _,
                  index // Render 6 skeleton loaders
                ) => (
                  <BlogCardSkeleton key={index} />
                )
              )}
            </div>
          ) : articles.length === 0 ? (
            // Empty State: No Articles Found Message
            <motion.div
              key="no-articles" // Key for AnimatePresence to handle mounting/unmounting
              className="text-center py-16 px-4 bg-white rounded-xl shadow-lg border border-gray-100" // Card styling
              initial={{ opacity: 0, scale: 0.9 }} // Starts smaller, fades in
              animate={{ opacity: 1, scale: 1 }} // Scales up, fades in
              exit={{ opacity: 0, scale: 0.9 }} // Fades out, shrinks when unmounted
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <FiFeather className="mx-auto text-7xl text-gray-400 mb-6" />{" "}
              {/* Large, subtle Feather icon */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Articles Published Yet
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Check back soon for new stories, insights, and inspiration!
              </p>
            </motion.div>
          ) : (
            // Article Grid: Displays actual BlogCards
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden" // Grid starts hidden
              animate="visible" // Grid animates visible
              variants={articleGridVariants} // Apply stagger animation to children
            >
              <AnimatePresence>
                {" "}
                {/* Not strictly needed here as items won't unmount individually, but good if filtering/pagination were added */}
                {articles.map((article, index) => (
                  <BlogCard key={article._id} article={article} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
