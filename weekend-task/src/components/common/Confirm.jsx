import { Modal, Typography, Button } from "antd";

const { Paragraph } = Typography;

function Confirm({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={480}
      closable={false}
      onCancel={onCancel}
    >
      <Typography.Title
        level={4}
        style={{
          color: danger ? "#EA5555" : "#000",
          marginBottom: 20,
        }}
      >
        {title}
      </Typography.Title>

      <Paragraph
        style={{
          color: "#828FA3",
          lineHeight: 1.7,
          marginBottom: 30,
        }}
      >
        {description}
      </Paragraph>

      <div
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <Button
          danger={danger}
          type="primary"
          loading={loading}
          block
          style={{
            height: 42,
            borderRadius: 25,
          }}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>

        <Button
          block
          style={{
            height: 42,
            borderRadius: 25,
          }}
          onClick={onCancel}
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
}

export default Confirm;