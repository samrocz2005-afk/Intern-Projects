import { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function AddTaskModal({
  open,
  onCancel,
  onSubmit,
  columns = [],
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: "",
        description: "",
        status: columns[0]?.id,
        subtasks: [
          { title: "" },
          { title: "" },
        ],
      });
    }
  }, [open, columns, form]);

  const handleFinish = (values) => {
    const task = {
      id: `task-${Date.now()}`,
      title: values.title.trim(),
      description: values.description?.trim() || "",
      status: values.status,

      subtasks: (values.subtasks || [])
        .filter(
          (subtask) =>
            subtask?.title &&
            subtask.title.trim() !== ""
        )
        .map((subtask, index) => ({
          id: `sub-${Date.now()}-${index}`,
          title: subtask.title.trim(),
          done: false,
        })),
    };

    onSubmit(task);

    form.resetFields();
  };

  return (
    <Modal
      open={open}
      centered
      width={520}
      footer={null}
      title="Add New Task"
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
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Task title is required",
            },
            {
              whitespace: true,
              message: "Task title is required",
            },
          ]}
        >
          <Input placeholder="e.g. Build UI for onboarding flow" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            rows={4}
            placeholder="e.g. Create responsive onboarding screens..."
          />
        </Form.Item>

        <Form.List name="subtasks">
          {(fields, { add, remove }) => (
            <>
              <label
                style={{
                  display: "block",
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                Subtasks
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
                    name={[field.name, "title"]}
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Subtask"
                      style={{
                        width: 360,
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
                  borderRadius: 24,
                  marginBottom: 20,
                  height: 42,
                }}
                onClick={() =>
                  add({
                    title: "",
                  })
                }
              >
                + Add New Subtask
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Please select a status",
            },
          ]}
        >
          <Select
            placeholder="Select Status"
            options={columns.map((column) => ({
              value: column.id,
              label: column.name,
            }))}
          />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          block
          style={{
            height: 45,
            borderRadius: 24,
          }}
        >
          Create Task
        </Button>
      </Form>
    </Modal>
  );
}

export default AddTaskModal;