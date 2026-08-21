import api from "./api";

const billingApi = {
  /*
  |--------------------------------------------------------------------------
  | CURRENT USER — BILLING
  |--------------------------------------------------------------------------
  | GET /api/billing
  |
  | Any authenticated user can access this.
  | Backend returns ONLY the authenticated user's billing.
  |--------------------------------------------------------------------------
  */

  getBilling: async (params = {}) => {
    const response = await api.get(
      "/billing",
      {
        params,
      }
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | CURRENT USER — SINGLE BILLING
  |--------------------------------------------------------------------------
  | GET /api/billing/:id
  |
  | Any authenticated user can access this.
  | Backend verifies that the billing belongs to req.user.
  |--------------------------------------------------------------------------
  */

  getBillingById: async (id) => {
    if (!id) {
      throw new Error(
        "Billing ID is required"
      );
    }

    const response = await api.get(
      `/billing/${id}`
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | ADMIN — ALL BILLING
  |--------------------------------------------------------------------------
  | GET /api/billing/admin/all
  |
  | Admin only.
  | Returns billing records for ALL users.
  |--------------------------------------------------------------------------
  */

  getAllBilling: async (params = {}) => {
    const response = await api.get(
      "/billing/admin/all",
      {
        params,
      }
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | ADMIN — GENERATE BILLING
  |--------------------------------------------------------------------------
  | POST /api/billing/generate
  |
  | Admin only.
  |--------------------------------------------------------------------------
  */

  generateBilling: async (
    billingData
  ) => {
    if (!billingData?.userId) {
      throw new Error(
        "User ID is required"
      );
    }

    if (
      !billingData?.periodStart ||
      !billingData?.periodEnd
    ) {
      throw new Error(
        "Billing period is required"
      );
    }

    const response = await api.post(
      "/billing/generate",
      billingData
    );

    return response.data;
  },
};

export default billingApi;