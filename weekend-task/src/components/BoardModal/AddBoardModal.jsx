import { Button, Form, Input, Modal, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const DEFAULT_COLORS = [
  "#49C4E5",
  "#8471F2",
  "#67E2AE",
  "#F39C12",
  "#E91E63",
  "#9C27B0",
];

function AddBoardModal({
  open,
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const boardId = `board-${Date.now()}`;

    const newBoard = {
      id: boardId,
      name: values.name.trim(),
      columns: values.columns.map((column, index) => ({
        id: `${boardId}-column-${index + 1}`,
        name: column.name.trim(),
        color:
          DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        tasks: [],
      })),
    };

    onSubmit(newBoard);

    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Add New Board"
      centered
      footer={null}
      width={500}
      destroyOnClose
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          columns: [
            { name: "Todo" },
            { name: "Doing" },
            { name: "Done" },
          ],
        }}
      >
        <Form.Item
          label="Board Name"
          name="name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Board name is required",
            },
          ]}
        >
          <Input placeholder="e.g. Web Design" />
        </Form.Item>

        <Form.List name="columns">
          {(fields, { add, remove }) => (
            <>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                Board Columns
              </label>

              {fields.map((field) => (
                <Space
                  key={field.key}
                  align="baseline"
                  style={{
                    display: "flex",
                    marginBottom: 12,
                  }}
                >
                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Column name"
                      style={{ width: 360 }}
                    />
                  </Form.Item>

                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={fields.length <= 1}
                    onClick={() => remove(field.name)}
                  />
                </Space>
              ))}

              <Button
                block
                type="default"
                style={{
                  borderRadius: 24,
                  marginBottom: 20,
                }}
                onClick={() => add({ name: "" })}
              >
                + Add New Column
              </Button>
            </>
          )}
        </Form.List>

        <Button
          htmlType="submit"
          type="primary"
          block
          style={{
            height: 45,
            borderRadius: 24,
          }}
        >
          Create New Board
        </Button>
      </Form>
    </Modal>
  );
}

export default AddBoardModal;