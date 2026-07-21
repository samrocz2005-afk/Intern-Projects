import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
} from "antd";

const { TextArea } = Input;
const currentYear = new Date().getFullYear();

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
    onSubmit({
      ...values,
      title: values.title.trim(),
      author: values.author.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      publishedYear: Number(values.publishedYear),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
    >
      {/* Title */}
      <Form.Item
        label="Book Title"
        name="title"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Please enter the book title.",
          },
          {
            min: 2,
            message: "Title should be at least 2 characters.",
          },
          {
            max: 100,
            message: "Title cannot exceed 100 characters.",
          },
          {
            pattern: /[A-Za-z]/,
            message:
              "Title should contain at least one letter.",
          },
        ]}
      >
        <Input
          maxLength={100}
          placeholder="e.g. Atomic Habits"
        />
      </Form.Item>

      {/* Author */}
      <Form.Item
        label="Author"
        name="author"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Please enter the author's name.",
          },
          {
            min: 2,
            message: "Author name is too short.",
          },
          {
            max: 50,
            message: "Author name cannot exceed 50 characters.",
          },
          {
            pattern: /^[A-Za-z\s.'-]+$/,
            message:
              "Use only letters, spaces, apostrophes (') and hyphens (-).",
          },
        ]}
      >
        <Input
          maxLength={50}
          placeholder="e.g. James Clear"
        />
      </Form.Item>

      {/* Category */}
      <Form.Item
        label="Category"
        name="category"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Please enter a category.",
          },
          {
            min: 2,
            message: "Category is too short.",
          },
          {
            max: 50,
            message: "Category cannot exceed 50 characters.",
          },
        ]}
      >
        <Input
          maxLength={50}
          placeholder="e.g. Self Help"
        />
      </Form.Item>

      {/* Published Year */}
      <Form.Item
        label="Published Year"
        name="publishedYear"
        rules={[
          {
            required: true,
            message: "Please enter the published year.",
          },
          {
            type: "number",
            min: 1000,
            max: currentYear,
            message: `Enter a year between 1000 and ${currentYear}.`,
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder="e.g. 2024"
        />
      </Form.Item>

      {/* Description */}
      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Please add a short description.",
          },
          {
            min: 20,
            message:
              "Description should be at least 20 characters.",
          },
          {
            max: 500,
            message:
              "Description cannot exceed 500 characters.",
          },
        ]}
      >
        <TextArea
          rows={4}
          maxLength={500}
          showCount
          placeholder="Briefly describe the book..."
        />
      </Form.Item>

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