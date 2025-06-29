import { createWriteStream } from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import "dotenv/config";
import connectDB from "./config/db.js";
import Product from "./models/productModel.js";

const generateSitemap = async () => {
  console.log("Connecting to database...");
  await connectDB();
  console.log("Database connected. Starting sitemap generation...");

  const frontendUrl = "https://brbartfusion.com"; // Replace with your actual domain

  const smStream = new SitemapStream({ hostname: frontendUrl });
  const writeStream = createWriteStream("../client/public/sitemap.xml"); // Output to frontend public folder

  smStream.pipe(writeStream);

  // Add static pages
  smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
  smStream.write({ url: "/shop", changefreq: "daily", priority: 0.8 });
  smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.7 });

  // Add all product pages
  const products = await Product.find({});
  products.forEach((product) => {
    smStream.write({
      url: `/product/${product._id}`,
      changefreq: "weekly",
      priority: 0.9,
      // You can add image data for better SEO
      // img: [{ url: product.images[0], title: product.name }]
    });
  });

  // Add all category pages
  const categories = await Product.find().distinct("category");
  categories.forEach((category) => {
    smStream.write({
      url: `/shop/category/${encodeURIComponent(category)}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  smStream.end();
  await streamToPromise(smStream);

  console.log("Sitemap generated successfully at client/public/sitemap.xml");
  process.exit(0); // Exit the script
};

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
  process.exit(1);
});
