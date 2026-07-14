import { useEffect } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";

const { Option } = Select;

const StudentForm = ({ onSubmit, editingStudent }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingStudent) {
      form.setFieldsValue(editingStudent);
    } else {
      form.resetFields();
    }
  }, [editingStudent, form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      validateTrigger="onChange"
      style={{ marginBottom: 30 }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Name is required",
          },
          {
            min: 3,
            message: "Name must be at least 3 characters",
          },
          {
            pattern: /^[A-Za-z ]+$/,
            message: "Name can contain only letters",
          },
        ]}
      >
        <Input placeholder="Enter student's name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Email is required",
          },
          {
            type: "email",
            message: "Enter a valid email address",
          },
        ]}
      >
        <Input placeholder="Enter student's email address" />
      </Form.Item>

      <Form.Item
        label="Department"
        name="department"
        rules={[
          {
            required: true,
            message: "Please select a department",
          },
        ]}
      >
        <Select placeholder="Select Department">
          <Option value="CSE">CSE</Option>
          <Option value="IT">IT</Option>
          <Option value="ECE">ECE</Option>
          <Option value="EEE">EEE</Option>
          <Option value="MECH">MECH</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Age"
        name="age"
        rules={[
          {
            required: true,
            message: "Age is required",
          },
          {
            type: "number",
            min: 18,
            message: "Age must be 18 or above",
          },
        ]}
      >
        <InputNumber
          placeholder="Enter age"
          style={{ width: "100%" }}
          min={18}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        {editingStudent ? "Update Student" : "Add Student"}
      </Button>
    </Form>
  );
};

export default StudentForm;