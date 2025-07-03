import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { motion } from "framer-motion"; // For animations

// Icon Imports
import { FiArrowLeft, FiUser, FiCalendar, FiBookOpen } from "react-icons/fi"; // Feather Icons

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Scroll to top when fetching a new article
        window.scrollTo(0, 0);
        const { data } = await API.get(`/articles/${slug}`);
        setArticle(data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Article not found.");
        setArticle(null); // Ensure article is null on error
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  // Framer Motion variants for staggered entry of elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger children by 0.1 seconds
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // --- Render Loading State ---
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <ClipLoader color="#BFA181" size={70} />
      </div>
    );

  // --- Render Article Not Found State ---
  if (!article)
    return (
      <div className="text-center py-16 text-gray-700 text-3xl font-semibold bg-gray-50 min-h-screen">
        Article Not Found.
      </div>
    );

  // Sanitize the HTML content before rendering
  const cleanHTML = DOMPurify.sanitize(article.content, {
    USE_PROFILES: { html: true },
  }); // Ensure HTML is allowed

  return (
    <>
      <Helmet>
        <title>{article.title} - BRB Art Fusion</title>
        <meta
          name="description"
          content={article.excerpt || article.content.substring(0, 160)} // Use excerpt if available
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8 md:py-12 lg:py-16">
        {" "}
        {/* Overall page background */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {" "}
          {/* Centered content, appropriate width */}
          {/* Back to Blog Link */}
          <Link
            to="/blog"
            className="inline-flex items-center text-brb-primary hover:text-brb-primary-dark transition-colors duration-200 mb-6 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back to Blog
          </Link>
          {/* Main Article Content Card */}
          <motion.div
            className="bg-white p-6 md:p-10 rounded-xl shadow-2xl border border-gray-100" // Elevated card styling
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Article Title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 text-center tracking-tight leading-tight"
              variants={itemVariants}
            >
              {article.title}
            </motion.h1>

            {/* Article Meta Info (Author & Date) */}
            <motion.p
              className="text-center text-gray-600 text-sm md:text-base mb-8 flex items-center justify-center space-x-4"
              variants={itemVariants}
            >
              <span className="flex items-center">
                <FiUser className="mr-2 text-gray-500" /> By{" "}
                <span className="font-semibold text-gray-800 ml-1">
                  {article.author?.name || "BRB Art Fusion"}
                </span>
              </span>
              <span className="flex items-center">
                <FiCalendar className="mr-2 text-gray-500" /> On{" "}
                <span className="font-semibold text-gray-800 ml-1">
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
            </motion.p>

            {/* Featured Image */}
            <motion.img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg my-8 shadow-xl border border-gray-200" // Enhanced image styling
              variants={itemVariants}
            />

            {/* Article Content */}
            <motion.div
              className="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed" // Tailwind prose for default HTML styling
              variants={itemVariants}
            >
              {parse(cleanHTML)}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
