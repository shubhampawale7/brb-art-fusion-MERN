import express from "express";
const router = express.Router();
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.use(protect);

router.route("/").get(getWishlist).post(addToWishlist);

router.route("/:productId").delete(removeFromWishlist);

export default router;
