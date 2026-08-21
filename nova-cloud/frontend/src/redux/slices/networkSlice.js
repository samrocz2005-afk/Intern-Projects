import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import networkApi from "../../services/networkApi";

const initialState = {
  items: [],
  selectedNetwork: null,

  loading: false,
  actionLoading: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Fetch Networks
|--------------------------------------------------------------------------
*/

export const fetchNetworks =
  createAsyncThunk(
    "networks/fetchNetworks",
    async (params = {}, { rejectWithValue }) => {
      try {
        const response =
          await networkApi.getNetworks(
            params
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load networks"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Fetch Network
|--------------------------------------------------------------------------
*/

export const fetchNetwork =
  createAsyncThunk(
    "networks/fetchNetwork",
    async (id, { rejectWithValue }) => {
      try {
        const response =
          await networkApi.getNetwork(id);

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load network"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Create Network
|--------------------------------------------------------------------------
*/

export const createNetwork =
  createAsyncThunk(
    "networks/createNetwork",
    async (
      networkData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await networkApi.createNetwork(
            networkData
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create network"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Update Network
|--------------------------------------------------------------------------
*/

export const updateNetwork =
  createAsyncThunk(
    "networks/updateNetwork",
    async (
      { id, data },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await networkApi.updateNetwork(
            id,
            data
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update network"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Delete Network
|--------------------------------------------------------------------------
*/

export const deleteNetwork =
  createAsyncThunk(
    "networks/deleteNetwork",
    async (id, { rejectWithValue }) => {
      try {
        await networkApi.deleteNetwork(id);

        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete network"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const networkSlice = createSlice({
  name: "networks",

  initialState,

  reducers: {
    clearNetworkError: (state) => {
      state.error = null;
    },

    clearSelectedNetwork: (state) => {
      state.selectedNetwork = null;
    },
  },

  extraReducers: (builder) => {
    /*
     * Fetch Networks
     */
    builder
      .addCase(
        fetchNetworks.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchNetworks.fulfilled,
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
        fetchNetworks.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Fetch Network
     */
    builder
      .addCase(
        fetchNetwork.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchNetwork.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedNetwork =
            action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchNetwork.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Create Network
     */
    builder
      .addCase(
        createNetwork.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        createNetwork.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items.unshift(
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        createNetwork.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Update Network
     */
    builder
      .addCase(
        updateNetwork.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateNetwork.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updated =
            action.payload;

          const index =
            state.items.findIndex(
              (item) =>
                item._id === updated._id
            );

          if (index !== -1) {
            state.items[index] =
              updated;
          }

          if (
            state.selectedNetwork?._id ===
            updated._id
          ) {
            state.selectedNetwork =
              updated;
          }

          state.error = null;
        }
      )

      .addCase(
        updateNetwork.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Delete Network
     */
    builder
      .addCase(
        deleteNetwork.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteNetwork.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items =
            state.items.filter(
              (item) =>
                item._id !== action.payload
            );

          if (
            state.selectedNetwork?._id ===
            action.payload
          ) {
            state.selectedNetwork = null;
          }
        }
      )

      .addCase(
        deleteNetwork.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );
  },
});

export const {
  clearNetworkError,
  clearSelectedNetwork,
} = networkSlice.actions;

export default networkSlice.reducer;