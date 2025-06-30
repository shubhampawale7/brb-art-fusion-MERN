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

// ✅ CORRECTED AND COMBINED ROUTES
router.route("/").get(getProducts).post(protect, admin, createProduct);

router.route("/categories").get(getProductCategories);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route("/:id/reviews").post(protect, createProductReview);

export default router;
