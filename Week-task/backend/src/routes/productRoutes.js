const express = require("express");

const productController = require("../controllers/productController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

/*
 * All product routes require authentication.
 */
router.use(verifyToken);

/*
 * GET /api/products
 * Search, filter, sort and paginate products.
 */
router.get("/", productController.getProducts);

/*
 * GET /api/products/:id
 */
router.get("/:id", productController.getProductById);

/*
 * POST /api/products
 * Admin and Manager can create products.
 */
router.post(
  "/",
  requireRole("Admin", "Staff"),
  productController.createProduct
);

/*
 * PUT /api/products/:id
 * Admin and Manager can update products.
 */
router.put(
  "/:id",
  requireRole("Admin", "Staff"),
  productController.updateProduct
);

/*
 * DELETE /api/products/:id
 * Only Admin can delete products.
 */
router.delete(
  "/:id",
  requireRole("Admin"),
  productController.deleteProduct
);

module.exports = router;