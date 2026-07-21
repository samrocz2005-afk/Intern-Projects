import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber } from "antd";

const BookForm = ({
  initialValues = null,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const bookData = {
      ...values,
      publishedYear: Number(values.publishedYear),
    };

    onSubmit(bookData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      {/* Title */}
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: "Please enter book title",
          },
        ]}
      >
        <Input placeholder="Enter book title" />
      </Form.Item>


      {/* Author */}
      <Form.Item
        label="Author"
        name="author"
        rules={[
          {
            required: true,
            message: "Please enter author name",
          },
        ]}
      >
        <Input placeholder="Enter author name" />
      </Form.Item>


      {/* Category */}
      <Form.Item
        label="Category"
        name="category"
        rules={[
          {
            required: true,
            message: "Please enter category",
          },
        ]}
      >
        <Input placeholder="Programming, Novel..." />
      </Form.Item>


      {/* Published Year */}
      <Form.Item
        label="Published Year"
        name="publishedYear"
        rules={[
          {
            required: true,
            message: "Please enter published year",
          },
          {
            type: "number",
            min: 1000,
            max: new Date().getFullYear(),
            message: "Enter a valid published year",
          },
        ]}
      >
        <InputNumber
          style={{
            width: "100%",
          }}
          placeholder="Example: 2024"
        />
      </Form.Item>


      {/* Description */}
      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter description"
        />
      </Form.Item>


      {/* Submit */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          {initialValues ? "Update Book" : "Create Book"}
        </Button>
      </Form.Item>

    </Form>
  );
};

export default BookForm;