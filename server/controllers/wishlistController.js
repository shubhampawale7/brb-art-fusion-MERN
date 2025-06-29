import User from "../models/userModel.js";

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  // Use $addToSet to prevent duplicates
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { wishlist: productId },
  });
  res.status(200).json({ message: "Item added to wishlist" });
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  // Use $pull to remove the item
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: productId },
  });
  res.status(200).json({ message: "Item removed from wishlist" });
};

export { getWishlist, addToWishlist, removeFromWishlist };
