import React from "react";
import { Modal } from "antd";
import { useDispatch } from "react-redux";

import { removeTask } from "../../features/tasks/taskSlice";

function DeleteTaskModal({
  open,
  task,
  onCancel,
}) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (task) {
      dispatch(removeTask(task.id));
    }

    onCancel();
  };

  return (
    <Modal
      title="Delete Task"
      open={open}
      onOk={handleDelete}
      onCancel={onCancel}
      okText="Delete"
      okButtonProps={{ danger: true }}
    >
      <p>
        Are you sure you want to delete
        <strong> {task?.title}</strong>?
      </p>
    </Modal>
  );
}

export default DeleteTaskModal;