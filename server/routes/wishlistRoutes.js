import express from "express";
const router = express.Router();
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middlewares/authMiddleware.js";

// All wishlist routes are protected and require a logged-in user
router.use(protect);

router.route("/").get(getWishlist).post(addToWishlist);

router.route("/:productId").delete(removeFromWishlist);

export default router;
