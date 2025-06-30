import path from "path";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "express-async-handler";
import "dotenv/config";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure Cloudinary with credentials from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to process the file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the upload route
// It's protected by admin middleware to ensure only admins can upload
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded.");
    }

    // Use a Promise to handle the stream-based upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        // We use 'auto' to let Cloudinary detect if it's an image or video
        { resource_type: "auto", folder: "brb-art-fusion" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Send back the secure URL provided by Cloudinary
    res.status(200).json({
      message: "File uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  })
);

export default router;
