import { create } from "zustand";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const useTaskStore = create((set, get) => ({
  // ==============================
  // State
  // ==============================

  tasks: [],
  loading: false,
  error: null,

  // ==============================
  // Fetch Tasks
  // ==============================

  fetchTasks: async (studentId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const tasks = await getTasks(studentId);

      set({
        tasks,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Failed to fetch tasks.",
      });
    }
  },

  // ==============================
  // Add Task
  // ==============================

  addTask: async (task) => {
    try {
      const newTask = await createTask(task);

      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
    } catch (error) {
      set({
        error: error.message || "Failed to add task.",
      });
    }
  },

  // ==============================
  // Update Task
  // ==============================

  editTask: async (task) => {
    try {
      const updatedTask = await updateTask(task.id, task);

      set((state) => ({
        tasks: state.tasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        ),
      }));
    } catch (error) {
      set({
        error: error.message || "Failed to update task.",
      });
    }
  },

  // ==============================
  // Delete Task
  // ==============================

  removeTask: async (id) => {
    try {
      await deleteTask(id);

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      set({
        error: error.message || "Failed to delete task.",
      });
    }
  },

  // ==============================
  // Clear Error
  // ==============================

  clearError: () =>
    set({
      error: null,
    }),

  // ==============================
  // Reset
  // ==============================

  resetTasks: () =>
    set({
      tasks: [],
      loading: false,
      error: null,
    }),
}));

export default useTaskStore;