import { useState } from "react";
import { Space, Button, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import {
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

export default function ActionMenu({
  student,
  onView,
  onEdit,
  onDelete,
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(student.id);
    setDeleteOpen(false);
  };

  return (
    <Space>
      <Button
        type="primary"
        icon={<Visibility />}
        onClick={() => onView(student)}
      >
        View
      </Button>

      <Button
        icon={<Edit />}
        onClick={() => onEdit(student)}
      >
        Edit
      </Button>

      <Button
        danger
        icon={<Delete />}
        onClick={() => setDeleteOpen(true)}
      >
        Delete
      </Button>

      <Modal
        open={deleteOpen}
        title={
          <>
            <ExclamationCircleFilled
              style={{ color: "#faad14", marginRight: 8 }}
            />
            Delete Student
          </>
        }
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this student?</p>
      </Modal>
    </Space>
  );
}