import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import billingApi from "../../services/billingApi";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  items: [],

  selectedBilling: null,

  history: [],

  usage: [],

  overview: null,

  summary: {
    total: 0,
    currentMonth: 0,
    previousMonth: 0,
    pending: 0,
    paid: 0,
  },

  loading: false,

  actionLoading: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const extractBillingData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| Build Usage Rows
|--------------------------------------------------------------------------
*/

const buildUsageRows = (billingRecords) => {
  return billingRecords.flatMap((billing) =>
    (billing.items || []).map((item, index) => ({
      _id: `${billing._id}-${index}`,

      billingId: billing._id,

      invoiceNumber: billing.invoiceNumber,

      user: billing.user || null,

      resourceType: item.resourceType,

      resource: item.resource,

      resourceName:
        item.resourceName || `${item.resourceType} ${item.resource}`,

      usageStart: billing.billingPeriodStart,

      usageEnd: billing.billingPeriodEnd,

      durationHours: Number(item.quantity || 0),

      unitPrice: Number(item.unitPrice || 0),

      amount: Number(item.amount || 0),

      currency: billing.currency || "INR",

      status: billing.status || "pending",

      createdAt: billing.createdAt,
    })),
  );
};

/*
|--------------------------------------------------------------------------
| Build Billing Overview
|--------------------------------------------------------------------------
*/

const buildOverview = (billingRecords) => {
  const now = new Date();

  const currentYear = now.getFullYear();

  const currentMonth = now.getMonth();

  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);

  const previousYear = previousMonthDate.getFullYear();

  const previousMonth = previousMonthDate.getMonth();

  let total = 0;

  let currentMonthTotal = 0;

  let previousMonthTotal = 0;

  let pending = 0;

  let paid = 0;

  const resourceIds = new Set();

  const recentCharges = [];

  billingRecords.forEach((billing) => {
    const amount = Number(billing.total || 0);

    total += amount;

    /*
      |--------------------------------------------------------------------------
      | Billing Date
      |--------------------------------------------------------------------------
      */

    const dateValue = billing.createdAt || billing.billingPeriodStart;

    const billingDate = dateValue ? new Date(dateValue) : null;

    if (billingDate && !Number.isNaN(billingDate.getTime())) {
      if (
        billingDate.getFullYear() === currentYear &&
        billingDate.getMonth() === currentMonth
      ) {
        currentMonthTotal += amount;
      }

      if (
        billingDate.getFullYear() === previousYear &&
        billingDate.getMonth() === previousMonth
      ) {
        previousMonthTotal += amount;
      }
    }

    /*
      |--------------------------------------------------------------------------
      | Status
      |--------------------------------------------------------------------------
      */

    const status = String(billing.status || "pending").toLowerCase();

    if (status === "pending") {
      pending += amount;
    }

    if (status === "paid") {
      paid += amount;
    }

    /*
      |--------------------------------------------------------------------------
      | Resources
      |--------------------------------------------------------------------------
      */

    (billing.items || []).forEach((item) => {
      if (item.resource) {
        resourceIds.add(String(item.resource));
      }
    });

    /*
      |--------------------------------------------------------------------------
      | Recent Charges
      |--------------------------------------------------------------------------
      */

    (billing.items || []).forEach((item, index) => {
      recentCharges.push({
        _id: `${billing._id}-${index}`,

        billingId: billing._id,

        invoiceNumber: billing.invoiceNumber,

        user: billing.user || null,

        resourceType: item.resourceType,

        resource: item.resource,

        resourceName:
          item.resourceName || `${item.resourceType} ${item.resource}`,

        usage: Number(item.quantity || 0),

        amount: Number(item.amount || 0),

        currency: billing.currency || "INR",

        createdAt: billing.createdAt,

        status: billing.status || "pending",
      });
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Sort Recent Charges
  |--------------------------------------------------------------------------
  */

  recentCharges.sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  );

  /*
  |--------------------------------------------------------------------------
  | Total Usage
  |--------------------------------------------------------------------------
  */

  const totalUsageHours = billingRecords
    .flatMap((billing) => billing.items || [])
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  /*
  |--------------------------------------------------------------------------
  | Return Overview
  |--------------------------------------------------------------------------
  */
 const currentBalance = Number(
  billingRecords?.[0]?.user?.balance ?? 0
);

  return {
    currentBalance,

    currentMonthTotal: Number(currentMonthTotal.toFixed(2)),

    previousMonthTotal: Number(previousMonthTotal.toFixed(2)),

    total: Number(total.toFixed(2)),

    pending: Number(pending.toFixed(2)),

    paid: Number(paid.toFixed(2)),

    activeResources: resourceIds.size,

    totalUsageHours: Number(totalUsageHours.toFixed(2)),

    recentCharges: recentCharges.slice(0, 10),
    };
};

/*
|--------------------------------------------------------------------------
| FETCH CURRENT USER BILLING
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This ALWAYS calls /api/billing.
|
| User -> own billing
| Admin -> admin's own billing
|
|--------------------------------------------------------------------------
*/

export const fetchBilling = createAsyncThunk(
  "billing/fetchBilling",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await billingApi.getBilling(params);

      return extractBillingData(response);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load billing",
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| FETCH BILLING HISTORY
|--------------------------------------------------------------------------
|
| Current authenticated user's billing only.
|
|--------------------------------------------------------------------------
*/

export const fetchBillingHistory = createAsyncThunk(
  "billing/fetchBillingHistory",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await billingApi.getBilling(params);

      return extractBillingData(response);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load billing history",
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| FETCH CURRENT USER BILLING OVERVIEW
|--------------------------------------------------------------------------
|
| IMPORTANT:
| ALWAYS /api/billing
|
| Never /api/billing/admin/all
|
|--------------------------------------------------------------------------
*/

export const fetchBillingOverview = createAsyncThunk(
  "billing/fetchBillingOverview",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await billingApi.getBilling(params);

      const billingRecords = extractBillingData(response);

      return {
        overview: buildOverview(billingRecords),

        records: billingRecords,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load billing overview",
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| FETCH CURRENT USER USAGE
|--------------------------------------------------------------------------
|
| ALWAYS /api/billing
|--------------------------------------------------------------------------
*/

export const fetchUsage = createAsyncThunk(
  "billing/fetchUsage",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await billingApi.getBilling(params);

      const billingRecords = extractBillingData(response);

      return buildUsageRows(billingRecords);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load usage",
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| ADMIN — FETCH ALL BILLING
|--------------------------------------------------------------------------
|
| ONLY use this from Admin Billing pages.
|
| GET /api/billing/admin/all
|--------------------------------------------------------------------------
*/

export const fetchAllBilling = createAsyncThunk(
  "billing/fetchAllBilling",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await billingApi.getAllBilling(params);

      return extractBillingData(response);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load all billing",
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| FETCH SINGLE BILLING
|--------------------------------------------------------------------------
|
| Current user's own billing record.
|--------------------------------------------------------------------------
*/

export const fetchBillingById = createAsyncThunk(
  "billing/fetchBillingById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await billingApi.getBillingById(id);

      return response?.data || response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load billing record",
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| ADMIN — GENERATE BILLING
|--------------------------------------------------------------------------
*/

export const generateBilling = createAsyncThunk(
  "billing/generateBilling",

  async (billingData, { rejectWithValue }) => {
    try {
      const response = await billingApi.generateBilling(billingData);

      return response?.data || response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate billing",
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const billingSlice = createSlice({
  name: "billing",

  initialState,

  reducers: {
    clearBillingError: (state) => {
      state.error = null;
    },

    clearSelectedBilling: (state) => {
      state.selectedBilling = null;
    },

    clearBilling: () => ({
      ...initialState,
    }),
  },

  extraReducers: (builder) => {
    /*
      |--------------------------------------------------------------------------
      | FETCH BILLING
      |--------------------------------------------------------------------------
      */

    builder
      .addCase(fetchBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBilling.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload;

        state.history = action.payload;

        state.error = null;
      })

      .addCase(fetchBilling.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    /*
      |--------------------------------------------------------------------------
      | FETCH BILLING HISTORY
      |--------------------------------------------------------------------------
      */

    builder
      .addCase(fetchBillingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBillingHistory.fulfilled, (state, action) => {
        state.loading = false;

        state.history = action.payload;

        state.items = action.payload;

        state.error = null;
      })

      .addCase(fetchBillingHistory.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    /*
      |--------------------------------------------------------------------------
      | FETCH BILLING OVERVIEW
      |--------------------------------------------------------------------------
      */

    builder
      .addCase(fetchBillingOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBillingOverview.fulfilled, (state, action) => {
        state.loading = false;

        state.overview = action.payload.overview;

        state.items = action.payload.records;

        const overview = action.payload.overview;

        state.summary = {
          total: overview.total,

          currentMonth: overview.currentMonthTotal,

          previousMonth: overview.previousMonthTotal,

          pending: overview.pending,

          paid: overview.paid,
        };

        state.error = null;
      })

      .addCase(fetchBillingOverview.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    /*
      |--------------------------------------------------------------------------
      | FETCH USAGE
      |--------------------------------------------------------------------------
      */

    builder
      .addCase(fetchUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsage.fulfilled, (state, action) => {
        state.loading = false;

        state.usage = action.payload;

        state.error = null;
      })

      .addCase(fetchUsage.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    /*
      |--------------------------------------------------------------------------
      | ADMIN — ALL BILLING
      |--------------------------------------------------------------------------
      */

    builder
      .addCase(fetchAllBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllBilling.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload;

        state.history = action.payload;

        state.error = null;
      })

      .addCase(fetchAllBilling.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    /*
      |--------------------------------------------------------------------------
      | SINGLE BILLING
      |--------------------------------------------------------------------------
      */

    builder
      .addCase(fetchBillingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBillingById.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedBilling = action.payload;

        state.error = null;
      })

      .addCase(fetchBillingById.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    /*
      |--------------------------------------------------------------------------
      | GENERATE BILLING
      |--------------------------------------------------------------------------
      */

    builder
      .addCase(generateBilling.pending, (state) => {
        state.actionLoading = true;

        state.error = null;
      })

      .addCase(generateBilling.fulfilled, (state, action) => {
        state.actionLoading = false;

        const billing = action.payload;

        if (billing) {
          const existingIndex = state.items.findIndex(
            (item) => item._id === billing._id,
          );

          if (existingIndex >= 0) {
            state.items[existingIndex] = billing;
          } else {
            state.items.unshift(billing);
          }

          const historyIndex = state.history.findIndex(
            (item) => item._id === billing._id,
          );

          if (historyIndex >= 0) {
            state.history[historyIndex] = billing;
          } else {
            state.history.unshift(billing);
          }
        }

        state.error = null;
      })

      .addCase(generateBilling.rejected, (state, action) => {
        state.actionLoading = false;

        state.error = action.payload;
      });
  },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const { clearBillingError, clearSelectedBilling, clearBilling } =
  billingSlice.actions;

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default billingSlice.reducer;
