import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products with all features
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice
    ? Number(req.query.maxPrice)
    : Number.MAX_SAFE_INTEGER;
  const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

  let sortOrder = { createdAt: -1 }; // Default sort
  switch (req.query.sort) {
    case "name_asc":
      sortOrder = { name: 1 };
      break;
    case "name_desc":
      sortOrder = { name: -1 };
      break;
    case "price_asc":
      sortOrder = { price: 1 };
      break;
    case "price_desc":
      sortOrder = { price: -1 };
      break;
    case "latest":
      sortOrder = { createdAt: -1 };
      break;
    case "toprated":
      sortOrder = { rating: -1 };
      break;
  }

  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...priceFilter,
  });
  const products = await Product.find({
    ...keyword,
    ...category,
    ...priceFilter,
  })
    .sort(sortOrder)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get a single product by ID
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get all unique product categories
// @route   GET /api/products/categories
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.find().distinct("category");
  res.json(categories);
});

// @desc    Create a product by an admin
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    images: ["/images/sample.jpg"],
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product by an admin
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    videos,
    category,
    countInStock,
    dimensions,
    weight,
    material,
  } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    if (!images || images.length === 0) {
      res.status(400);
      throw new Error("At least one product image is required.");
    }
    product.name = name;
    product.price = Number(price);
    product.description = description;
    product.images = images;
    product.videos = videos || [];
    product.category = category;
    product.countInStock = Number(countInStock);
    product.dimensions = dimensions;
    product.weight = weight;
    product.material = material;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product by an admin
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductCategories,
};
