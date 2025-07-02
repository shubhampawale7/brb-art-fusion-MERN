import express from "express";
const router = express.Router();
import { trackingWebhook } from "../controllers/trackingController.js";

// This is the public endpoint Shiprocket will send data to.
router.post("/", trackingWebhook);

export default router;
