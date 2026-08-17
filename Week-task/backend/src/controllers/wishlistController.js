const asyncHandler = require("../utils/asyncHandler");
const wishlistService = require("../services/wishlistService");

const getWishlists = asyncHandler(async (req, res) => {
  const result = await wishlistService.getWishlists(req.query);

  res.status(200).json({
    success: true,
    message: "Wishlists fetched successfully",
    data: result.wishlists,
    pagination: result.pagination,
  });
});

const getWishlistByCustomer = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlistByCustomer(
    req.params.customerId
  );

  res.status(200).json({
    success: true,
    message: "Customer wishlist fetched successfully",
    data: wishlist,
  });
});

const addProductToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.addProduct(
    req.params.customerId,
    req.body.productId
  );

  res.status(200).json({
    success: true,
    message: "Product added to wishlist successfully",
    data: wishlist,
  });
});

const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.removeProduct(
    req.params.customerId,
    req.params.productId
  );

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist successfully",
    data: wishlist,
  });
});

module.exports = {
  getWishlists,
  getWishlistByCustomer,
  addProductToWishlist,
  removeProductFromWishlist,
};