import { useCallback, useMemo, useState } from "react";

function useTasks(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);

  // ==========================
  // Statistics
  // ==========================

  const totalTasks = useMemo(() => {
    return tasks.length;
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.subtasks.every((subtask) => subtask.done)
    ).length;
  }, [tasks]);

  // ==========================
  // Add Task
  // ==========================

  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  // ==========================
  // Update Task
  // ==========================

  const updateTask = useCallback((updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );
  }, []);

  // ==========================
  // Delete Task
  // ==========================

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    );
  }, []);

  // ==========================
  // Change Status
  // ==========================

  const changeStatus = useCallback((taskId, status) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task
      )
    );
  }, []);

  // ==========================
  // Toggle Subtask
  // ==========================

  const toggleSubtask = useCallback(
    (taskId, subtaskId) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          return {
            ...task,
            subtasks: task.subtasks.map(
              (subtask) =>
                subtask.id === subtaskId
                  ? {
                      ...subtask,
                      done: !subtask.done,
                    }
                  : subtask
            ),
          };
        })
      );
    },
    []
  );

  // ==========================
  // Move Task
  // ==========================

  const moveTask = useCallback((taskId, status) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task
      )
    );
  }, []);

  // ==========================
  // Get Task
  // ==========================

  const getTask = useCallback(
    (taskId) => {
      return tasks.find(
        (task) => task.id === taskId
      );
    },
    [tasks]
  );

  return {
    tasks,
    setTasks,

    totalTasks,
    completedTasks,

    addTask,
    updateTask,
    deleteTask,

    changeStatus,
    toggleSubtask,
    moveTask,

    getTask,
  };
}

export default useTasks;