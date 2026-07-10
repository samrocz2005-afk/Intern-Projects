import React, { useEffect, useState } from "react";
import { Button, Modal, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";

import TaskForm from "../components/tasks/TaskForm";
import TaskTable from "../components/tasks/TaskTable";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import { fetchTasks } from "../features/tasks/taskSlice";

import {
  selectTasks,
  selectTaskLoading,
  selectTaskError,
} from "../features/tasks/taskSelectors";

const { Title } = Typography;

function Tasks() {
  const dispatch = useDispatch();

  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTaskLoading);
  const error = useSelector(selectTaskError);

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

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

  if (loading) {
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

      {tasks.length === 0 ? (
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
        title={
          selectedTask
            ? "Edit Task"
            : "Add Task"
        }
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