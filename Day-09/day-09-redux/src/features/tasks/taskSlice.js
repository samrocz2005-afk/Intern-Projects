import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/taskService";

// ==============================
// Initial State
// ==============================

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// ==============================
// Fetch Tasks
// ==============================

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTasks();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks."
      );
    }
  }
);

// ==============================
// Add Task
// ==============================

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task, { rejectWithValue }) => {
    try {
      const data = await createTask(task);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add task."
      );
    }
  }
);

// ==============================
// Update Task
// ==============================

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, task }, { rejectWithValue }) => {
    try {
      const data = await updateTask(id, task);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task."
      );
    }
  }
);

// ==============================
// Delete Task
// ==============================

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task."
      );
    }
  }
);

// ==============================
// Slice
// ==============================

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================
      // Fetch Tasks
      // ======================

      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Add Task
      // ======================

      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })

      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Update Task
      // ======================

      .addCase(editTask.pending, (state) => {
        state.loading = true;
      })

      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(editTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Delete Task
      // ======================

      .addCase(removeTask.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload
        );
      })

      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;

export default taskSlice.reducer;