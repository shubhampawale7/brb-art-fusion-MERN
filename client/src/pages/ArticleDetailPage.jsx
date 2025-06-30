import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/articles/${slug}`);
        setArticle(data);
      } catch (error) {
        toast.error("Article not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ClipLoader />
      </div>
    );
  if (!article)
    return (
      <div className="h-screen text-center pt-20 font-serif text-2xl">
        Article Not Found.
      </div>
    );

  // Sanitize the HTML content before rendering
  const cleanHTML = DOMPurify.sanitize(article.content);

  return (
    <>
      <Helmet>
        <title>{article.title} - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
          {article.title}
        </h1>
        <p className="text-center text-text-secondary">
          By {article.author?.name || "BRB Art Fusion"} on{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-auto max-h-[500px] object-cover rounded-lg my-8"
        />
        <div className="prose lg:prose-xl max-w-none">{parse(cleanHTML)}</div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
