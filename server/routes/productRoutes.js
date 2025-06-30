import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductCategories,
} from "../controllers/productController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

// --- Grouped & Organized Routes ---

// --- Base Route ---
// GET is public, POST requires a logged-in admin.
router.route("/").get(getProducts).post(protect, admin, createProduct); // This line ensures only admins can create products

// --- Categories Route (Public) ---
router.route("/categories").get(getProductCategories);

// --- Routes by Specific Product ID ---
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// --- Review Route ---
// Only a logged-in user can create a review
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
