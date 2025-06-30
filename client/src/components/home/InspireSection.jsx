import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import API from "../../services/api";

const InspirationSection = () => {
  // State to hold articles fetched from the API
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect to fetch the latest 3 articles on component mount
  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const { data } = await API.get("/articles?limit=3");
        setArticles(data);
      } catch (error) {
        console.error("Failed to load articles for homepage", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestArticles();
  }, []);

  return (
    <motion.section
      className="py-20 bg-page-bg"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold font-serif text-text-primary">
            Inspire and Elevate
          </h2>
          <Link
            to="/blog"
            className="font-semibold text-brand-accent hover:underline flex items-center"
          >
            View All <FaArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <p>Loading articles...</p>
          ) : (
            articles.map((article) => (
              // Using dynamic data like article.slug, article.featuredImage, etc.
              <Link
                to={`/blog/${article.slug}`}
                key={article._id}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
                  <div className="overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-serif font-bold text-text-primary mb-2 flex-grow">
                      {article.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4">
                      {article.excerpt}
                    </p>
                    <span className="mt-auto inline-block font-semibold text-brand-accent group-hover:underline">
                      Read More
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default InspirationSection;
