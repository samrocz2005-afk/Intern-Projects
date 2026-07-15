import { Form, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";

const BookForm = ({
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
      title={initialValues ? "Edit Book" : "Add Book"}
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
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Enter title",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Author"
          name="author"
          rules={[
            {
              required: true,
              message: "Enter author",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Enter price",
            },
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            {
              required: true,
              message: "Enter stock",
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Thumbnail URL"
          name="thumbnail"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookForm;