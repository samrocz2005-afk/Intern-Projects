import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import storageApi from "../../services/storageApi";

const initialState = {
  items: [],
  selectedStorage: null,

  loading: false,
  actionLoading: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Fetch Storage
|--------------------------------------------------------------------------
*/

export const fetchStorage = createAsyncThunk(
  "storage/fetchStorage",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await storageApi.getStorage(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load storage"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Fetch Single Storage
|--------------------------------------------------------------------------
*/

export const fetchStorageById =
  createAsyncThunk(
    "storage/fetchStorageById",
    async (id, { rejectWithValue }) => {
      try {
        const response =
          await storageApi.getStorageById(id);

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load storage"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Create Storage
|--------------------------------------------------------------------------
*/

export const createStorage =
  createAsyncThunk(
    "storage/createStorage",
    async (
      storageData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await storageApi.createStorage(
            storageData
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create storage"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Update Storage
|--------------------------------------------------------------------------
*/

export const updateStorage =
  createAsyncThunk(
    "storage/updateStorage",
    async (
      { id, data },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await storageApi.updateStorage(
            id,
            data
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update storage"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Attach Storage
|--------------------------------------------------------------------------
*/

export const attachStorage =
  createAsyncThunk(
    "storage/attachStorage",
    async (
      { storageId, instanceId },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await storageApi.attachStorage(
            storageId,
            instanceId
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to attach storage"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Detach Storage
|--------------------------------------------------------------------------
*/

export const detachStorage =
  createAsyncThunk(
    "storage/detachStorage",
    async (
      storageId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await storageApi.detachStorage(
            storageId
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to detach storage"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Delete Storage
|--------------------------------------------------------------------------
*/

export const deleteStorage =
  createAsyncThunk(
    "storage/deleteStorage",
    async (id, { rejectWithValue }) => {
      try {
        await storageApi.deleteStorage(id);

        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete storage"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const storageSlice = createSlice({
  name: "storage",

  initialState,

  reducers: {
    clearStorageError: (state) => {
      state.error = null;
    },

    clearSelectedStorage: (state) => {
      state.selectedStorage = null;
    },
  },

  extraReducers: (builder) => {
    /*
     * Fetch Storage
     */
    builder
      .addCase(
        fetchStorage.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStorage.fulfilled,
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
        fetchStorage.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Fetch Single Storage
     */
    builder
      .addCase(
        fetchStorageById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStorageById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedStorage =
            action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchStorageById.rejected,
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
        createStorage.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        createStorage.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items.unshift(
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        createStorage.rejected,
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
        updateStorage.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateStorage.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateStorageInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        updateStorage.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Attach
     */
    builder
      .addCase(
        attachStorage.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        attachStorage.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateStorageInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        attachStorage.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload;
        }
      );

    /*
     * Detach
     */
    builder
      .addCase(
        detachStorage.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        detachStorage.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateStorageInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        detachStorage.rejected,
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
        deleteStorage.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteStorage.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items =
            state.items.filter(
              (item) =>
                item._id !== action.payload
            );

          if (
            state.selectedStorage?._id ===
            action.payload
          ) {
            state.selectedStorage = null;
          }
        }
      )

      .addCase(
        deleteStorage.rejected,
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

const updateStorageInState = (
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
    state.selectedStorage?._id ===
    updated._id
  ) {
    state.selectedStorage = updated;
  }
};

export const {
  clearStorageError,
  clearSelectedStorage,
} = storageSlice.actions;

export default storageSlice.reducer;