import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getFlavors,
  getFlavor,
  createFlavor as createFlavorApi,
  updateFlavor as updateFlavorApi,
  updateFlavorStatus as updateFlavorStatusApi,
  deleteFlavor as deleteFlavorApi,
} from "../../services/flavorApi";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  items: [],
  selectedFlavor: null,

  loading: false,
  actionLoading: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Fetch Flavors
|--------------------------------------------------------------------------
*/

export const fetchFlavors = createAsyncThunk(
  "flavors/fetchFlavors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getFlavors(params);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch flavors"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Fetch Single Flavor
|--------------------------------------------------------------------------
*/

export const fetchFlavor = createAsyncThunk(
  "flavors/fetchFlavor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getFlavor(id);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch flavor"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Create Flavor
|--------------------------------------------------------------------------
*/

export const createFlavor = createAsyncThunk(
  "flavors/createFlavor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createFlavorApi(data);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create flavor"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Update Flavor
|--------------------------------------------------------------------------
*/

export const updateFlavor = createAsyncThunk(
  "flavors/updateFlavor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateFlavorApi(id, data);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update flavor"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Update Flavor Status
|--------------------------------------------------------------------------
*/

export const updateFlavorStatus = createAsyncThunk(
  "flavors/updateFlavorStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await updateFlavorStatusApi(
        id,
        isActive
      );

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update flavor status"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Delete Flavor
|--------------------------------------------------------------------------
*/

export const deleteFlavor = createAsyncThunk(
  "flavors/deleteFlavor",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFlavorApi(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete flavor"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const flavorSlice = createSlice({
  name: "flavors",

  initialState,

  reducers: {
    clearFlavorError: (state) => {
      state.error = null;
    },

    clearFlavors: (state) => {
      state.items = [];
    },

    clearSelectedFlavor: (state) => {
      state.selectedFlavor = null;
    },
  },

  extraReducers: (builder) => {
    /*
    |--------------------------------------------------------------------------
    | Fetch Flavors
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(fetchFlavors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFlavors.fulfilled, (state, action) => {
        state.loading = false;

        /*
         * Supports both:
         * response.data = [...]
         * response.data = { items: [...] }
         * response = [...]
         */

        const payload = action.payload;

        if (Array.isArray(payload)) {
          state.items = payload;
        } else if (Array.isArray(payload?.items)) {
          state.items = payload.items;
        } else if (Array.isArray(payload?.flavors)) {
          state.items = payload.flavors;
        } else {
          state.items = [];
        }
      })

      .addCase(fetchFlavors.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch flavors";
      });

    /*
    |--------------------------------------------------------------------------
    | Fetch Flavor
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(fetchFlavor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFlavor.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFlavor = action.payload;
      })

      .addCase(fetchFlavor.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch flavor";
      });

    /*
    |--------------------------------------------------------------------------
    | Create Flavor
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(createFlavor.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createFlavor.fulfilled, (state, action) => {
        state.actionLoading = false;

        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      .addCase(createFlavor.rejected, (state, action) => {
        state.actionLoading = false;
        state.error =
          action.payload || "Failed to create flavor";
      });

    /*
    |--------------------------------------------------------------------------
    | Update Flavor
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(updateFlavor.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateFlavor.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedFlavor = action.payload;

        if (!updatedFlavor) {
          return;
        }

        const index = state.items.findIndex(
          (item) =>
            String(item._id || item.id) ===
            String(
              updatedFlavor._id ||
                updatedFlavor.id
            )
        );

        if (index !== -1) {
          state.items[index] = updatedFlavor;
        }

        if (
          state.selectedFlavor &&
          String(
            state.selectedFlavor._id ||
              state.selectedFlavor.id
          ) ===
            String(
              updatedFlavor._id ||
                updatedFlavor.id
            )
        ) {
          state.selectedFlavor = updatedFlavor;
        }
      })

      .addCase(updateFlavor.rejected, (state, action) => {
        state.actionLoading = false;
        state.error =
          action.payload || "Failed to update flavor";
      });

    /*
    |--------------------------------------------------------------------------
    | Update Flavor Status
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(updateFlavorStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(
        updateFlavorStatus.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedFlavor = action.payload;

          if (!updatedFlavor) {
            return;
          }

          const index = state.items.findIndex(
            (item) =>
              String(item._id || item.id) ===
              String(
                updatedFlavor._id ||
                  updatedFlavor.id
              )
          );

          if (index !== -1) {
            state.items[index] = updatedFlavor;
          }

          if (
            state.selectedFlavor &&
            String(
              state.selectedFlavor._id ||
                state.selectedFlavor.id
            ) ===
              String(
                updatedFlavor._id ||
                  updatedFlavor.id
              )
          ) {
            state.selectedFlavor = updatedFlavor;
          }
        }
      )

      .addCase(
        updateFlavorStatus.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload ||
            "Failed to update flavor status";
        }
      );

    /*
    |--------------------------------------------------------------------------
    | Delete Flavor
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(deleteFlavor.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(deleteFlavor.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.items = state.items.filter(
          (item) =>
            String(item._id || item.id) !==
            String(action.payload)
        );

        if (
          state.selectedFlavor &&
          String(
            state.selectedFlavor._id ||
              state.selectedFlavor.id
          ) === String(action.payload)
        ) {
          state.selectedFlavor = null;
        }
      })

      .addCase(deleteFlavor.rejected, (state, action) => {
        state.actionLoading = false;
        state.error =
          action.payload || "Failed to delete flavor";
      });
  },
});

/*
|--------------------------------------------------------------------------
| Local Actions
|--------------------------------------------------------------------------
*/

export const {
  clearFlavorError,
  clearFlavors,
  clearSelectedFlavor,
} = flavorSlice.actions;

/*
|--------------------------------------------------------------------------
| Compatibility Aliases
|--------------------------------------------------------------------------
|
| Existing pages may still use these older thunk names.
| Keep them so we don't have to redesign the existing pages.
|--------------------------------------------------------------------------
*/

export const addFlavor = createFlavor;
export const editFlavor = updateFlavor;
export const changeFlavorStatus = updateFlavorStatus;
export const removeFlavor = deleteFlavor;

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default flavorSlice.reducer;