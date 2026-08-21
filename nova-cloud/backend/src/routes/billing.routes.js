const express = require("express");

const router = express.Router();

const billingController =
  require("../controllers/billing.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  authorize,
} = require("../middleware/role.middleware");

const {
  validate,
} = require("../middleware/validate.middleware");

const {
  billingIdSchema,
  generateBillingSchema,
} = require("../validators/billing.validator");

/*
|--------------------------------------------------------------------------
| USER + ADMIN — OWN BILLING
|--------------------------------------------------------------------------
| Any authenticated user can see their own billing.
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  billingController.getBilling
);

/*
|--------------------------------------------------------------------------
| ADMIN — ALL USERS BILLING
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  billingController.getAllBilling
);

/*
|--------------------------------------------------------------------------
| ADMIN — GENERATE BILLING
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",
  protect,
  authorize("admin"),
  validate(generateBillingSchema),
  billingController.generateBilling
);

/*
|--------------------------------------------------------------------------
| USER + ADMIN — SINGLE OWN BILLING
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  validate(billingIdSchema),
  billingController.getBillingById
);

module.exports = router;