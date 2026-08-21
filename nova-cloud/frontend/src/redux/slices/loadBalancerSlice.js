import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import loadBalancerApi from "../../services/loadBalancerApi";

const initialState = {
  items: [],
  selectedLoadBalancer: null,

  loading: false,
  actionLoading: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Fetch Load Balancers
|--------------------------------------------------------------------------
*/

export const fetchLoadBalancers = createAsyncThunk(
  "loadBalancers/fetchLoadBalancers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await loadBalancerApi.getLoadBalancers(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load load balancers"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Fetch Single Load Balancer
|--------------------------------------------------------------------------
*/

export const fetchLoadBalancer = createAsyncThunk(
  "loadBalancers/fetchLoadBalancer",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await loadBalancerApi.getLoadBalancer(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load load balancer"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Compatibility Alias
|--------------------------------------------------------------------------
| Details page expects fetchLoadBalancerById.
| IMPORTANT: This must come AFTER fetchLoadBalancer.
|--------------------------------------------------------------------------
*/

export const fetchLoadBalancerById =
  fetchLoadBalancer;

/*
|--------------------------------------------------------------------------
| Create Load Balancer
|--------------------------------------------------------------------------
*/

export const createLoadBalancer = createAsyncThunk(
  "loadBalancers/createLoadBalancer",
  async (
    loadBalancerData,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await loadBalancerApi.createLoadBalancer(
          loadBalancerData
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create load balancer"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Add Backend Instance
|--------------------------------------------------------------------------
*/

export const addBackendInstance = createAsyncThunk(
  "loadBalancers/addBackendInstance",
  async (
    { loadBalancerId, backendData },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await loadBalancerApi.addBackendInstance(
          loadBalancerId,
          backendData
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to add backend instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Remove Backend Instance
|--------------------------------------------------------------------------
*/

export const removeBackendInstance = createAsyncThunk(
  "loadBalancers/removeBackendInstance",
  async (
    { loadBalancerId, backendId },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await loadBalancerApi.removeBackendInstance(
          loadBalancerId,
          backendId
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to remove backend instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Update Backend Health
|--------------------------------------------------------------------------
*/

export const updateBackendHealth = createAsyncThunk(
  "loadBalancers/updateBackendHealth",
  async (
    {
      loadBalancerId,
      backendId,
      healthStatus,
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await loadBalancerApi.updateBackendHealth(
          loadBalancerId,
          backendId,
          healthStatus
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update backend health"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Delete Load Balancer
|--------------------------------------------------------------------------
*/

export const deleteLoadBalancer = createAsyncThunk(
  "loadBalancers/deleteLoadBalancer",
  async (id, { rejectWithValue }) => {
    try {
      await loadBalancerApi.deleteLoadBalancer(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete load balancer"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

const updateLoadBalancerInState = (
  state,
  updated
) => {
  if (!updated?._id && !updated?.id) {
    return;
  }

  const updatedId =
    updated._id || updated.id;

  const index = state.items.findIndex(
    (item) =>
      item._id === updatedId ||
      item.id === updatedId
  );

  if (index !== -1) {
    state.items[index] = updated;
  }

  const selectedId =
    state.selectedLoadBalancer?._id ||
    state.selectedLoadBalancer?.id;

  if (selectedId === updatedId) {
    state.selectedLoadBalancer =
      updated;
  }
};

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const loadBalancerSlice = createSlice({
  name: "loadBalancers",

  initialState,

  reducers: {
    clearLoadBalancerError: (state) => {
      state.error = null;
    },

    clearSelectedLoadBalancer: (state) => {
      state.selectedLoadBalancer = null;
    },
  },

  extraReducers: (builder) => {
    /*
     * Fetch List
     */
    builder
      .addCase(
        fetchLoadBalancers.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLoadBalancers.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            Array.isArray(action.payload)
              ? action.payload
              : action.payload?.items || [];

          state.error = null;
        }
      )

      .addCase(
        fetchLoadBalancers.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    /*
     * Fetch Single
     */
    builder
      .addCase(
        fetchLoadBalancer.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLoadBalancer.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedLoadBalancer =
            action.payload;

          state.error = null;
        }
      )

      .addCase(
        fetchLoadBalancer.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    /*
     * Create
     */
    builder
      .addCase(
        createLoadBalancer.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        createLoadBalancer.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          if (action.payload) {
            state.items.unshift(
              action.payload
            );
          }

          state.error = null;
        }
      )

      .addCase(
        createLoadBalancer.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );

    /*
     * Add Backend
     */
    builder
      .addCase(
        addBackendInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        addBackendInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateLoadBalancerInState(
            state,
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        addBackendInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );

    /*
     * Remove Backend
     */
    builder
      .addCase(
        removeBackendInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        removeBackendInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateLoadBalancerInState(
            state,
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        removeBackendInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );

    /*
     * Backend Health
     */
    builder
      .addCase(
        updateBackendHealth.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateBackendHealth.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateLoadBalancerInState(
            state,
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        updateBackendHealth.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );

    /*
     * Delete
     */
    builder
      .addCase(
        deleteLoadBalancer.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteLoadBalancer.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items =
            state.items.filter(
              (item) =>
                item._id !== action.payload &&
                item.id !== action.payload
            );

          const selectedId =
            state.selectedLoadBalancer?._id ||
            state.selectedLoadBalancer?.id;

          if (
            selectedId === action.payload
          ) {
            state.selectedLoadBalancer =
              null;
          }

          state.error = null;
        }
      )

      .addCase(
        deleteLoadBalancer.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearLoadBalancerError,
  clearSelectedLoadBalancer,
} =
  loadBalancerSlice.actions;

export default loadBalancerSlice.reducer;