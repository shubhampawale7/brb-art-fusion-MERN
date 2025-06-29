import path from "path";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the upload route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded.");
    }

    // Upload file to Cloudinary
    // We use a stream to upload the file buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "brb-art-fusion" }, // You can specify a folder
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Send back the secure URL
    res.status(200).send({
      message: "Image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export default router;
