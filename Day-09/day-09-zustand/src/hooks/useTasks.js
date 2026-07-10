import useTaskStore from "../store/taskStore";

function useTasks() {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    clearError,
    resetTasks,
  } = useTaskStore();

  const loadTasks = async (studentId) => {
    await fetchTasks(studentId);
  };

  const createTask = async (task) => {
    await addTask(task);
  };

  const updateTask = async (task) => {
    await editTask(task);
  };

  const deleteTask = async (id) => {
    await removeTask(id);
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
    resetTasks,
  };
}

export default useTasks;