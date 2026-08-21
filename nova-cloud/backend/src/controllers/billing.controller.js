const billingService = require("../services/billing.service");

const {
  successResponse,
} = require("../utils/apiResponse");

const getBilling = async (
  req,
  res,
  next
) => {
  try {
    const billing =
      await billingService.getUserBilling(
        req.user._id,
        req.query
      );

    return successResponse(
      res,
      billing,
      "Billing records retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET /api/billing/:id
|--------------------------------------------------------------------------
| Authenticated user:
| Get ONLY their own billing record.
|--------------------------------------------------------------------------
*/

const getBillingById = async (
  req,
  res,
  next
) => {
  try {
    const billing =
      await billingService.getBillingById(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      billing,
      "Billing record retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET /api/billing/admin/all
|--------------------------------------------------------------------------
| ADMIN ONLY
|
| Get billing records belonging to ALL users.
|--------------------------------------------------------------------------
*/

const getAllBilling = async (
  req,
  res,
  next
) => {
  try {
    const billing =
      await billingService.getAllBilling(
        req.query
      );

    return successResponse(
      res,
      billing,
      "All billing records retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| POST /api/billing/generate
|--------------------------------------------------------------------------
| ADMIN ONLY
|
| Generate/update billing for a specific user.
|--------------------------------------------------------------------------
*/

const generateBilling = async (
  req,
  res,
  next
) => {
  try {
    const {
      userId,
      periodStart,
      periodEnd,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate userId
    |--------------------------------------------------------------------------
    */

    if (!userId) {
      const error = new Error(
        "userId is required"
      );

      error.statusCode = 400;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate billing period
    |--------------------------------------------------------------------------
    */

    if (
      !periodStart ||
      !periodEnd
    ) {
      const error = new Error(
        "periodStart and periodEnd are required"
      );

      error.statusCode = 400;

      throw error;
    }

    const startDate =
      new Date(periodStart);

    const endDate =
      new Date(periodEnd);

    /*
    |--------------------------------------------------------------------------
    | Validate dates
    |--------------------------------------------------------------------------
    */

    if (
      Number.isNaN(
        startDate.getTime()
      ) ||
      Number.isNaN(
        endDate.getTime()
      )
    ) {
      const error = new Error(
        "Invalid billing period dates"
      );

      error.statusCode = 400;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate date order
    |--------------------------------------------------------------------------
    */

    if (
      endDate <= startDate
    ) {
      const error = new Error(
        "periodEnd must be after periodStart"
      );

      error.statusCode = 400;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | Generate billing
    |--------------------------------------------------------------------------
    */

    const billing =
      await billingService.processUserBilling(
        userId,
        startDate,
        endDate
      );

    /*
    |--------------------------------------------------------------------------
    | No billable usage
    |--------------------------------------------------------------------------
    */

    if (!billing) {
      return successResponse(
        res,
        null,
        "No billable usage found"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return successResponse(
      res,
      billing,
      "Billing generated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  getBilling,
  getBillingById,
  getAllBilling,
  generateBilling,
};