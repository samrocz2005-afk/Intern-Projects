import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";

const StudentForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={initialValues ? "Edit Student" : "Add Student"}
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please enter first name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please enter last name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Enter valid email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[
            {
              required: true,
              message: "Enter age",
            },
          ]}
        >
          <InputNumber
            min={1}
            max={100}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
              message: "Select gender",
            },
          ]}
        >
          <Select
            options={[
              {
                label: "Male",
                value: "male",
              },
              {
                label: "Female",
                value: "female",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="University"
          name="university"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;