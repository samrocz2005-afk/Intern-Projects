import React, { useEffect, useState, useRef } from "react";
import { Button, Modal, Typography } from "antd";

import TaskForm from "../components/tasks/TaskForm";
import TaskTable from "../components/tasks/TaskTable";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import useAuth from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";

const { Title } = Typography;

function Tasks() {
  const { user } = useAuth();

  const {
    tasks = [], // Safe array fallback
    loading,
    error,
    loadTasks,
  } = useTasks();

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Guard to prevent continuous infinite state updates 
  const lastFetchedUserId = useRef(null);

  useEffect(() => {
    if (user?.id && lastFetchedUserId.current !== user.id) {
      lastFetchedUserId.current = user.id;
      loadTasks(user.id);
    }
  }, [user?.id, loadTasks]); // Fixed: Track user.id specifically instead of the entire user object

  const handleAdd = () => {
    setSelectedTask(null);
    setOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  // Fixed full page loader pattern. Only show full block if we don't have tasks initially loaded.
  if (loading && tasks.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <Title level={2}>My Tasks</Title>

      <ErrorMessage message={error} />

      <Button
        type="primary"
        onClick={handleAdd}
        style={{ marginBottom: 20 }}
      >
        Add Task
      </Button>

      {(tasks || []).length === 0 ? (
        <EmptyState
          description="No Tasks Found"
          buttonText="Create Task"
          onButtonClick={handleAdd}
        />
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={handleEdit}
        />
      )}

      <Modal
        open={open}
        footer={null}
        onCancel={handleClose}
        destroyOnClose
        title={selectedTask ? "Edit Task" : "Add Task"}
      >
        <TaskForm
          selectedTask={selectedTask}
          onFinish={handleClose}
        />
      </Modal>
    </>
  );
}

export default Tasks;