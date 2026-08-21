import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import routerApi from "../../services/routerApi";

const initialState = {
  items: [],
  selectedRouter: null,

  loading: false,
  actionLoading: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Fetch Routers
|--------------------------------------------------------------------------
*/

export const fetchRouters = createAsyncThunk(
  "routers/fetchRouters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await routerApi.getRouters(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load routers"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Fetch Router
|--------------------------------------------------------------------------
*/

export const fetchRouter = createAsyncThunk(
  "routers/fetchRouter",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await routerApi.getRouter(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load router"
      );
    }
  }
);

export const fetchRouterById = fetchRouter;

/*
|--------------------------------------------------------------------------
| Create Router
|--------------------------------------------------------------------------
*/

export const createRouter = createAsyncThunk(
  "routers/createRouter",
  async (
    routerData,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await routerApi.createRouter(
          routerData
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create router"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Update Router
|--------------------------------------------------------------------------
*/

export const updateRouter = createAsyncThunk(
  "routers/updateRouter",
  async (
    { id, data },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await routerApi.updateRouter(
          id,
          data
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update router"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Connect Network
|--------------------------------------------------------------------------
*/

export const connectNetwork =
  createAsyncThunk(
    "routers/connectNetwork",
    async (
      { routerId, networkId },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await routerApi.connectNetwork(
            routerId,
            networkId
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to connect network"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Disconnect Network
|--------------------------------------------------------------------------
*/

export const disconnectNetwork =
  createAsyncThunk(
    "routers/disconnectNetwork",
    async (
      { routerId, networkId },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await routerApi.disconnectNetwork(
            routerId,
            networkId
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to disconnect network"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Delete Router
|--------------------------------------------------------------------------
*/

export const deleteRouter = createAsyncThunk(
  "routers/deleteRouter",
  async (id, { rejectWithValue }) => {
    try {
      await routerApi.deleteRouter(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete router"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const routerSlice = createSlice({
  name: "routers",

  initialState,

  reducers: {
    clearRouterError: (state) => {
      state.error = null;
    },

    clearSelectedRouter: (state) => {
      state.selectedRouter = null;
    },
  },

  extraReducers: (builder) => {
    /*
     * Fetch Routers
     */
    builder
      .addCase(
        fetchRouters.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchRouters.fulfilled,
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
        fetchRouters.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Fetch Router
     */
    builder
      .addCase(
        fetchRouter.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchRouter.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedRouter =
            action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchRouter.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Create
     */
    builder
      .addCase(
        createRouter.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        createRouter.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items.unshift(
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        createRouter.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Update
     */
    builder
      .addCase(
        updateRouter.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateRouter.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateRouterInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        updateRouter.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Connect Network
     */
    builder
      .addCase(
        connectNetwork.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        connectNetwork.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateRouterInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        connectNetwork.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Disconnect Network
     */
    builder
      .addCase(
        disconnectNetwork.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        disconnectNetwork.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateRouterInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        disconnectNetwork.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Delete
     */
    builder
      .addCase(
        deleteRouter.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteRouter.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items =
            state.items.filter(
              (item) =>
                item._id !== action.payload
            );

          if (
            state.selectedRouter?._id ===
            action.payload
          ) {
            state.selectedRouter = null;
          }
        }
      )

      .addCase(
        deleteRouter.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );
  },
});

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

const updateRouterInState = (
  state,
  updated
) => {
  if (!updated?._id) {
    return;
  }

  const index =
    state.items.findIndex(
      (item) =>
        item._id === updated._id
    );

  if (index !== -1) {
    state.items[index] = updated;
  }

  if (
    state.selectedRouter?._id ===
    updated._id
  ) {
    state.selectedRouter = updated;
  }
};

export const {
  clearRouterError,
  clearSelectedRouter,
} = routerSlice.actions;

export default routerSlice.reducer;