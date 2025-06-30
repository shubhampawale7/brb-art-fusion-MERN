import Product from "../models/productModel.js";

// @desc    Fetch all products with search, filter, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = 8;
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

  let sortOrder = {};
  if (req.query.sort === "latest") {
    sortOrder = { createdAt: -1 }; // Newest first
  } else if (req.query.sort === "toprated") {
    sortOrder = { rating: -1 }; // Highest rating first
  }

  try {
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
  } catch (error) {
    res.status(500);
    throw new Error("Error fetching products");
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Get all unique product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = async (req, res) => {
  const categories = await Product.find().distinct("category");
  res.json(categories);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    images: ["/images/sample.jpg"],
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    dimensions: "N/A",
    weight: "N/A",
    material: "100% Brass",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
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
      // Add specific validation checks before attempting to save
      if (!name || !category || !description) {
        res.status(400);
        throw new Error("Name, category, and description are required fields.");
      }
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
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
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
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductCategories,
};
