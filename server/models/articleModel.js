import mongoose from "mongoose";
import slugify from "slugify";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      // For the URL, e.g., 'benefits-of-brass'
      type: String,
      unique: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    content: {
      // This will store the main body of the article, likely as HTML
      type: String,
      required: true,
    },
    excerpt: {
      // A short summary for display on cards
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // The admin who wrote it
    },
  },
  { timestamps: true }
);

// Before saving, automatically create the slug from the title
articleSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
