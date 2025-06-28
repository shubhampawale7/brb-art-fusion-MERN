import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { createProductReview } from "../controllers/productController.js";

// This line needs to handle both GET and POST requests
router.route("/").get(getProducts).post(protect, admin, createProduct); // <-- FIX IS HERE

// These routes handle requests for a specific product ID
router.route("/:id/reviews").post(protect, createProductReview);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
