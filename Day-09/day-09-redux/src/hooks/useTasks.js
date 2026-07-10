import { useDispatch, useSelector } from "react-redux";

import {
  fetchTasks,
  addTask,
  editTask,
  removeTask,
} from "../features/tasks/taskSlice";

import {
  selectTasks,
  selectTaskLoading,
  selectTaskError,
} from "../features/tasks/taskSelectors";

function useTasks() {
  const dispatch = useDispatch();

  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTaskLoading);
  const error = useSelector(selectTaskError);

  const loadTasks = () => {
    dispatch(fetchTasks());
  };

  const createTask = (task) => {
    dispatch(addTask(task));
  };

  const updateTask = (id, task) => {
    dispatch(
      editTask({
        id,
        task,
      })
    );
  };

  const deleteTask = (id) => {
    dispatch(removeTask(id));
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}

export default useTasks;