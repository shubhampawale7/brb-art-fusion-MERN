// server/models/productModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Establishes a relationship with the User model
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // The admin who added the product
    },
    name: {
      type: String,
      required: true,
    },
    images: [
      { type: String, required: true }, // Array of image URLs
    ],
    videos: [
      { type: String }, // Array of video URLs
    ],
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // e.g., 'Brass Murtis', 'Lanterns', 'Decorative Items'
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema], // Nested reviews
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
