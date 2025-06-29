import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductCategories, // <-- Import new function
} from "../controllers/productController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

// Public routes
router.route("/").get(getProducts);
router.route("/categories").get(getProductCategories); // <-- New route
router.route("/:id").get(getProductById);

// Private route for reviews
router.route("/:id/reviews").post(protect, createProductReview);

// Admin only routes
router.route("/").post(protect, admin, createProduct);
router.route("/:id").put(protect, admin, updateProduct);
router.route("/:id").delete(protect, admin, deleteProduct);

export default router;
