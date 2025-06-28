import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getUsers, // <-- Import
  deleteUser, // <-- Import
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/authMiddleware.js"; // <-- Import middleware

// Public Routes
router.route("/register").post(registerUser);
router.route("/login").post(authUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// Admin Only Routes
router.route("/").get(protect, admin, getUsers);
router.route("/:id").delete(protect, admin, deleteUser);

export default router;
