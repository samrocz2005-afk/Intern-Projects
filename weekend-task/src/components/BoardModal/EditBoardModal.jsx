import { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function EditBoardModal({
  open,
  board,
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && board) {
      form.setFieldsValue({
        name: board.name,
        columns: board.columns,
      });
    }
  }, [open, board, form]);

  const handleFinish = (values) => {
    if (!board) return;

    const updatedBoard = {
      ...board,
      name: values.name.trim(),

      columns: values.columns.map((column, index) => {
        const existingColumn = board.columns.find(
          (item) => item.id === column.id
        );

        return {
          id: column.id || `column-${Date.now()}-${index}`,
          name: column.name.trim(),

          // preserve existing data
          color:
            existingColumn?.color || "#635FC7",

          tasks:
            existingColumn?.tasks || [],
        };
      }),
    };

    onSubmit(updatedBoard);

    form.resetFields();

    onCancel();
  };

  return (
    <Modal
      open={open}
      centered
      footer={null}
      width={500}
      title="Edit Board"
      destroyOnHidden
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Board Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Board name is required",
            },
            {
              whitespace: true,
              message: "Board name is required",
            },
          ]}
        >
          <Input placeholder="Board Name" />
        </Form.Item>

        <Form.List name="columns">
          {(fields, { add, remove }) => (
            <>
              <label
                style={{
                  display: "block",
                  marginBottom: 12,
                  fontWeight: 600,
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
                  {/* Preserve id */}
                  <Form.Item
                    name={[field.name, "id"]}
                    hidden
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Column Name"
                      style={{
                        width: 340,
                      }}
                    />
                  </Form.Item>

                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      remove(field.name)
                    }
                  />
                </Space>
              ))}

              <Button
                block
                type="default"
                style={{
                  marginBottom: 20,
                  borderRadius: 24,
                  height: 42,
                }}
                onClick={() =>
                  add({
                    name: "",
                  })
                }
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
          Save Changes
        </Button>
      </Form>
    </Modal>
  );
}

export default EditBoardModal;