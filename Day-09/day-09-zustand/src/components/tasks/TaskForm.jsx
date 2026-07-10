import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";

import useTasks from "../../hooks/useTasks";
import useAuth from "../../hooks/useAuth";

const { TextArea } = Input;

function TaskForm({ selectedTask, onFinish }) {
  const [form] = Form.useForm();

  const { user } = useAuth();

  const {
    createTask,
    updateTask,
  } = useTasks();

  useEffect(() => {
    if (selectedTask) {
      form.setFieldsValue({
        ...selectedTask,
        dueDate: dayjs(selectedTask.dueDate),
      });
    } else {
      form.resetFields();
    }
  }, [selectedTask, form]);

  const handleSubmit = async (values) => {
    try {
      const task = {
        ...values,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
      };

      if (selectedTask) {
        await updateTask({
          ...selectedTask,
          ...task,
        });

        message.success("Task updated successfully.");
      } else {
        await createTask({
          ...task,
          studentId: user.id,
        });

        message.success("Task created successfully.");
      }

      form.resetFields();

      if (onFinish) {
        onFinish();
      }
    } catch (error) {
      message.error(error.message || "Something went wrong.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: "Please enter the task title.",
          },
        ]}
      >
        <Input placeholder="Enter task title" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Please enter the description.",
          },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Enter task description"
        />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        rules={[
          {
            required: true,
            message: "Please select a priority.",
          },
        ]}
      >
        <Select
          placeholder="Select priority"
          options={[
            {
              value: "High",
              label: "High",
            },
            {
              value: "Medium",
              label: "Medium",
            },
            {
              value: "Low",
              label: "Low",
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[
          {
            required: true,
            message: "Please select a status.",
          },
        ]}
      >
        <Select
          placeholder="Select status"
          options={[
            {
              value: "Pending",
              label: "Pending",
            },
            {
              value: "In Progress",
              label: "In Progress",
            },
            {
              value: "Completed",
              label: "Completed",
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[
          {
            required: true,
            message: "Please select a due date.",
          },
        ]}
      >
        <DatePicker
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        block
      >
        {selectedTask ? "Update Task" : "Add Task"}
      </Button>
    </Form>
  );
}

export default TaskForm;