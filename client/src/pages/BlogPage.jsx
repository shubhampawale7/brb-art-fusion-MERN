import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../services/api";
import { toast } from "sonner";

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await API.get("/articles");
        setArticles(data);
      } catch (error) {
        toast.error("Failed to load articles.");
      }
    };
    fetchArticles();
  }, []);

  return (
    <>
      <Helmet>
        <title>Inspire & Elevate - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold font-serif text-center mb-12">
          Inspire & Elevate
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              to={`/blog/${article.slug}`}
              key={article._id}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-text-primary h-24 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <span className="font-semibold text-brand-accent group-hover:underline">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default BlogPage;
