import asyncHandler from "express-async-handler"; // Import the handler
import Article from "../models/articleModel.js";

// @desc    Fetch all articles
// @route   GET /api/articles
const getArticles = asyncHandler(async (req, res) => {
  // Wrap the function
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const articles = await Article.find({}).sort({ createdAt: -1 }).limit(limit);
  res.json(articles);
});

// @desc    Fetch a single article by its slug
// @route   GET /api/articles/:slug
const getArticleBySlug = asyncHandler(async (req, res) => {
  // Wrap the function
  const article = await Article.findOne({ slug: req.params.slug }).populate(
    "author",
    "name"
  );

  if (article) {
    res.json(article);
  } else {
    res.status(404);
    throw new Error("Article not found"); // asyncHandler will catch this
  }
});

export { getArticles, getArticleBySlug };
