import express from "express";
const router = express.Router();
import { submitContactForm } from "../controllers/userController.js"; // Adjust path if you made a new controller

router.route("/").post(submitContactForm);

export default router;
