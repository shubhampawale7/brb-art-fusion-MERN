import path from "path"; // Needed for deployment
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

// Middleware Imports
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Initialize DB connection
connectDB();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// --- Mount All API Routes with Debug Try/Catch ---
const mountRoutes = async () => {
  try {
    const userRoutes = (await import("./routes/userRoutes.js")).default;
    app.use("/api/users", userRoutes);
  } catch (err) {
    console.error("❌ Crash in userRoutes.js:", err);
  }

  try {
    const productRoutes = (await import("./routes/productRoutes.js")).default;
    app.use("/api/products", productRoutes);
  } catch (err) {
    console.error("❌ Crash in productRoutes.js:", err);
  }

  try {
    const contactRoutes = (await import("./routes/contactRoutes.js")).default;
    app.use("/api/contact", contactRoutes);
  } catch (err) {
    console.error("❌ Crash in contactRoutes.js:", err);
  }

  try {
    const orderRoutes = (await import("./routes/orderRoutes.js")).default;
    app.use("/api/orders", orderRoutes);
  } catch (err) {
    console.error("❌ Crash in orderRoutes.js:", err);
  }

  try {
    const wishlistRoutes = (await import("./routes/wishlistRoutes.js")).default;
    app.use("/api/wishlist", wishlistRoutes);
  } catch (err) {
    console.error("❌ Crash in wishlistRoutes.js:", err);
  }

  try {
    const uploadRoutes = (await import("./routes/uploadRoutes.js")).default;
    app.use("/api/upload", uploadRoutes);
  } catch (err) {
    console.error("❌ Crash in uploadRoutes.js:", err);
  }

  try {
    const articleRoutes = (await import("./routes/articleRoutes.js")).default;
    app.use("/api/articles", articleRoutes);
  } catch (err) {
    console.error("❌ Crash in articleRoutes.js:", err);
  }
};

// Call the async route mounting
await mountRoutes();

// --- Deployment Configuration ---
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
