import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import instanceApi from "../../services/instanceApi";

const initialState = {
  items: [],
  selectedInstance: null,

  loading: false,
  actionLoading: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Helper: extract API data
|--------------------------------------------------------------------------
*/

const getApiData = (response) => {
  return response?.data?.data ??
    response?.data ??
    response;
};

/*
|--------------------------------------------------------------------------
| Get Instances
|--------------------------------------------------------------------------
*/

export const fetchInstances = createAsyncThunk(
  "instances/fetchInstances",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await instanceApi.getInstances(params);

      return getApiData(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load instances"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Get Single Instance
|--------------------------------------------------------------------------
*/

export const fetchInstance = createAsyncThunk(
  "instances/fetchInstance",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await instanceApi.getInstance(id);

      return getApiData(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Create Instance
|--------------------------------------------------------------------------
*/

export const createInstance = createAsyncThunk(
  "instances/createInstance",
  async (
    instanceData,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await instanceApi.createInstance(
          instanceData
        );

      return getApiData(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Update Instance
|--------------------------------------------------------------------------
*/

export const updateInstance = createAsyncThunk(
  "instances/updateInstance",
  async (
    { id, data },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await instanceApi.updateInstance(
          id,
          data
        );

      return getApiData(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Start Instance
|--------------------------------------------------------------------------
*/

export const startInstance = createAsyncThunk(
  "instances/startInstance",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await instanceApi.startInstance(id);

      return getApiData(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to start instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Stop Instance
|--------------------------------------------------------------------------
*/

export const stopInstance = createAsyncThunk(
  "instances/stopInstance",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await instanceApi.stopInstance(id);

      return getApiData(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to stop instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Restart Instance
|--------------------------------------------------------------------------
*/

export const restartInstance =
  createAsyncThunk(
    "instances/restartInstance",
    async (id, { rejectWithValue }) => {
      try {
        const response =
          await instanceApi.restartInstance(
            id
          );

        return getApiData(response);
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to restart instance"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Delete Instance
|--------------------------------------------------------------------------
*/

export const deleteInstance = createAsyncThunk(
  "instances/deleteInstance",
  async (id, { rejectWithValue }) => {
    try {
      await instanceApi.deleteInstance(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete instance"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Helper: update instance in Redux
|--------------------------------------------------------------------------
*/

const updateInstanceInState = (
  state,
  updated
) => {
  if (!updated) {
    return;
  }

  const updatedId =
    updated._id || updated.id;

  if (!updatedId) {
    return;
  }

  const index =
    state.items.findIndex(
      (item) =>
        String(item._id || item.id) ===
        String(updatedId)
    );

  if (index !== -1) {
    state.items[index] = updated;
  }

  if (
    state.selectedInstance &&
    String(
      state.selectedInstance._id ||
        state.selectedInstance.id
    ) === String(updatedId)
  ) {
    state.selectedInstance = updated;
  }
};

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const instanceSlice = createSlice({
  name: "instances",

  initialState,

  reducers: {
    clearInstanceError: (state) => {
      state.error = null;
    },

    clearSelectedInstance: (state) => {
      state.selectedInstance = null;
    },
  },

  extraReducers: (builder) => {
    /*
     * Fetch Instances
     */

    builder
      .addCase(
        fetchInstances.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchInstances.fulfilled,
        (state, action) => {
          state.loading = false;

          const payload =
            action.payload;

          if (Array.isArray(payload)) {
            state.items = payload;
          } else if (
            Array.isArray(
              payload?.items
            )
          ) {
            state.items =
              payload.items;
          } else if (
            Array.isArray(
              payload?.instances
            )
          ) {
            state.items =
              payload.instances;
          } else {
            state.items = [];
          }

          state.error = null;
        }
      )

      .addCase(
        fetchInstances.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to load instances";
        }
      );

    /*
     * Fetch Single Instance
     */

    builder
      .addCase(
        fetchInstance.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchInstance.fulfilled,
        (state, action) => {
          state.loading = false;

          const instance =
            action.payload;

          state.selectedInstance =
            instance;

          if (instance) {
            const instanceId =
              instance._id ||
              instance.id;

            const index =
              state.items.findIndex(
                (item) =>
                  String(
                    item._id ||
                      item.id
                  ) ===
                  String(instanceId)
              );

            if (index !== -1) {
              state.items[index] =
                instance;
            } else {
              state.items.push(
                instance
              );
            }
          }

          state.error = null;
        }
      )

      .addCase(
        fetchInstance.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to load instance";
        }
      );

    /*
     * Create
     */

    builder
      .addCase(
        createInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        createInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const instance =
            action.payload;

          if (instance) {
            state.items.unshift(
              instance
            );
          }

          state.error = null;
        }
      )

      .addCase(
        createInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload ||
            "Failed to create instance";
        }
      );

    /*
     * Update
     */

    builder
      .addCase(
        updateInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateInstanceInState(
            state,
            action.payload
          );

          state.error = null;
        }
      )

      .addCase(
        updateInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload ||
            "Failed to update instance";
        }
      );

    /*
     * Start
     */

    builder
      .addCase(
        startInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        startInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateInstanceInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        startInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload ||
            "Failed to start instance";
        }
      );

    /*
     * Stop
     */

    builder
      .addCase(
        stopInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        stopInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateInstanceInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        stopInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload ||
            "Failed to stop instance";
        }
      );

    /*
     * Restart
     */

    builder
      .addCase(
        restartInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        restartInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          updateInstanceInState(
            state,
            action.payload
          );
        }
      )

      .addCase(
        restartInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload ||
            "Failed to restart instance";
        }
      );

    /*
     * Delete
     */

    builder
      .addCase(
        deleteInstance.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteInstance.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.items =
            state.items.filter(
              (item) =>
                String(
                  item._id ||
                    item.id
                ) !==
                String(action.payload)
            );

          if (
            state.selectedInstance &&
            String(
              state.selectedInstance._id ||
                state.selectedInstance.id
            ) ===
              String(action.payload)
          ) {
            state.selectedInstance =
              null;
          }

          state.error = null;
        }
      )

      .addCase(
        deleteInstance.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error =
            action.payload ||
            "Failed to delete instance";
        }
      );
  },
});

export const {
  clearInstanceError,
  clearSelectedInstance,
} = instanceSlice.actions;

export default instanceSlice.reducer;