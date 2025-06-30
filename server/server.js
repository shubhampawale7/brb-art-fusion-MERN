import path from "path"; // Needed for deployment
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";

// Middleware Imports
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Initialize DB connection
connectDB();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// --- Mount All API Routes ---
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/articles", articleRoutes);
app.get("/", (req, res) => {
  res.send("API running - basic route only");
});
// --- Deployment Configuration ---
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  // Set the frontend build folder as a static folder
  app.use(express.static(path.join(__dirname, "/client/dist")));

  // For any route that is not an API route, serve the frontend's index.html
  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  // In development, just have a simple root route
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}
// --- End of Deployment Configuration ---

// --- Custom Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
