import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

// Public Routes
router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// Private User Routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin Only Routes
router.route("/").get(protect, admin, getUsers);
router.route("/:id").delete(protect, admin, deleteUser);

export default router;
