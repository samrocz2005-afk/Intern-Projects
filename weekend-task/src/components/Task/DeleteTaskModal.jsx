import { useState } from "react";
import {
  Modal,
  Typography,
  Button,
} from "antd";

const { Title, Paragraph } = Typography;

function DeleteTaskModal({
  open,
  task,
  onDelete,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!task) return;

    setLoading(true);

    try {
      await Promise.resolve(onDelete(task.id));
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={480}
      closable={false}
      destroyOnHidden
      onCancel={onCancel}
    >
      <Title
        level={4}
        style={{
          color: "#EA5555",
          marginBottom: 20,
        }}
      >
        Delete this task?
      </Title>

      <Paragraph
        style={{
          color: "#828FA3",
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        Are you sure you want to delete{" "}
        <strong>{task?.title || "this task"}</strong>?
        This action will permanently remove the task
        and all of its subtasks. This action cannot
        be undone.
      </Paragraph>

      <div
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <Button
          danger
          type="primary"
          block
          loading={loading}
          disabled={!task}
          style={{
            height: 42,
            borderRadius: 24,
          }}
          onClick={handleDelete}
        >
          Delete
        </Button>

        <Button
          block
          disabled={loading}
          style={{
            height: 42,
            borderRadius: 24,
          }}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteTaskModal;