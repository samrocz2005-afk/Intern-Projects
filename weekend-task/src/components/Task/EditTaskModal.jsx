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

function EditTaskModal({
  open,
  task,
  columns = [],
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        subtasks: task.subtasks || [],
      });
    } else {
      form.resetFields();
    }
  }, [open, task, form]);

  const handleFinish = (values) => {
    if (!task) return;

    const updatedTask = {
      ...task,
      title: values.title.trim(),
      description: values.description?.trim() || "",
      status: values.status,
      subtasks: (values.subtasks || [])
        .filter(
          (item) =>
            item?.title &&
            item.title.trim() !== ""
        )
        .map((item, index) => ({
          id:
            item.id ||
            `sub-${Date.now()}-${index}`,
          title: item.title.trim(),
          done: item.done ?? false,
        })),
    };

    onSubmit(updatedTask);
  };

  return (
    <Modal
      open={open}
      footer={null}
      title="Edit Task"
      centered
      width={480}
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
              whitespace: true,
              message: "Please enter a task title",
            },
          ]}
        >
          <Input placeholder="e.g. Take coffee break" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            rows={4}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </Form.Item>

        <Form.List
          name="subtasks"
          initialValue={[]}
        >
          {(fields, { add, remove }) => (
            <>
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                Subtasks
              </div>

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
                    name={[field.name, "id"]}
                    hidden
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "done"]}
                    hidden
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "title"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Subtask"
                      style={{ width: 340 }}
                    />
                  </Form.Item>

                  <Button
                    type="text"
                    danger
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
                  height: 40,
                  borderRadius: 20,
                  marginBottom: 24,
                }}
                onClick={() =>
                  add({
                    title: "",
                    done: false,
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
            placeholder="Select status"
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
            height: 44,
            borderRadius: 22,
          }}
        >
          Save Changes
        </Button>
      </Form>
    </Modal>
  );
}

export default EditTaskModal;