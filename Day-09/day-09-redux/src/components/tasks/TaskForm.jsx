import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

import { addTask, editTask } from "../../features/tasks/taskSlice";

const { TextArea } = Input;

function TaskForm({ selectedTask, onFinish }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

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

  const handleSubmit = (values) => {
    const task = {
      ...values,
      dueDate: values.dueDate.format("YYYY-MM-DD"),
    };

    if (selectedTask) {
      dispatch(
        editTask({
          id: selectedTask.id,
          task,
        })
      );
    } else {
      dispatch(addTask(task));
    }

    form.resetFields();

    if (onFinish) {
      onFinish();
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
            message: "Enter task title",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Enter description",
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={[
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
            { value: "Low", label: "Low" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={[
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[
          {
            required: true,
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