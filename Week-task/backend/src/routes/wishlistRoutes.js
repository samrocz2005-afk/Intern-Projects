const express = require("express");

const wishlistController = require("../controllers/wishlistController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/wishlists
router.get(
  "/",
  wishlistController.getWishlists
);

// GET /api/wishlists/customer/:customerId
router.get(
  "/customer/:customerId",
  wishlistController.getWishlistByCustomer
);

// POST /api/wishlists/:customerId/products
router.post(
  "/:customerId/products",
  wishlistController.addProductToWishlist
);

// DELETE /api/wishlists/:customerId/products/:productId
router.delete(
  "/:customerId/products/:productId",
  wishlistController.removeProductFromWishlist
);

module.exports = router;