import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js"; // <-- 1. Import the new routes
import uploadRoutes from "./routes/uploadRoutes.js";

// Middleware Imports
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Initialize DB connection
connectDB();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount the Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/upload", uploadRoutes); // <-- 2. This is the essential line to add

// Use the custom error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
