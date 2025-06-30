import express from "express";
const router = express.Router();
// Change this import from userController.js to contactController.js
import { submitContactForm } from "../controllers/contactController.js";

router.route("/").post(submitContactForm);

export default router;
