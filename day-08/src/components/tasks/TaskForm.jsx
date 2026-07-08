import { useState } from "react";
import { Form, Input, Button, Select, Alert } from "antd";

import { addTask } from "../../services/api";
import { validateTask } from "../../utils/validation";

const SHOW_PRIORITY =
  process.env.REACT_APP_ENABLE_TASK_PRIORITY === "true";

function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async () => {
    const validationErrors = validateTask(title);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const newTask = await addTask({
        title: title.trim(),
        priority,
      });

      onTaskAdded(newTask);

      setTitle("");
      setPriority("Medium");
      setErrors({});
    } catch (error) {
      setApiError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {apiError && (
        <Alert
          type="error"
          title={apiError}
          style={{ marginBottom: 20 }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Task Title"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title}
        >
          <Input
            placeholder="Enter task title"
            value={title}
            maxLength={60}
            showCount
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>

        {SHOW_PRIORITY && (
          <Form.Item label="Priority">
            <Select
              value={priority}
              onChange={(value) => setPriority(value)}
            >
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default TaskForm;