import { Modal, Typography, Button, Space } from "antd";
import { useDispatch } from "react-redux";
import { deleteBoard } from "../../redux/slices/boardSlice";
import useUIStore from "../../zustand/uiStore";

const { Title, Text } = Typography;

function DeleteBoardModal({
  open,
  board,
  onCancel,
}) {
  const dispatch = useDispatch();

  const { setShowDeleteBoard } = useUIStore();

  const handleDelete = () => {
    if (!board) return;

    dispatch(deleteBoard(board.id));

    setShowDeleteBoard(false);

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={480}
      closable={false}
      onCancel={onCancel}
    >
      <Title
        level={4}
        style={{
          color: "#EA5555",
          marginBottom: 20,
        }}
      >
        Delete this board?
      </Title>

      <Text
        style={{
          color: "#828FA3",
          display: "block",
          marginBottom: 28,
          lineHeight: 1.7,
        }}
      >
        Are you sure you want to delete the "
        <strong>{board?.name}</strong>" board?
        This action will permanently delete the board,
        all columns, and all tasks. This action cannot
        be reversed.
      </Text>

      <Space
        style={{
          width: "100%",
        }}
      >
        <Button
          danger
          type="primary"
          block
          onClick={handleDelete}
        >
          Delete
        </Button>

        <Button
          block
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Space>
    </Modal>
  );
}

export default DeleteBoardModal;