import { useEffect, useState } from "react";

import { Modal, Form, Button as AntButton } from "antd";

import {
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

const departments = ["CSE", "ECE", "EEE", "IT"];

export default function StudentForm({
  open,
  onCancel,
  onAdd,
  onUpdate,
  editingStudent,
  students,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      form.setFieldsValue(editingStudent);
    } else {
      form.resetFields();
    }
  }, [editingStudent, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const name = values.name.trim();

      const duplicate = students.some(
        (student) =>
          student.id !== editingStudent?.id &&
          student.name.toLowerCase() ===
            name.toLowerCase() &&
          student.department === values.department
      );

      if (duplicate) {
        form.setFields([
          {
            name: "name",
            errors: [
              "Student already exists in this department.",
            ],
          },
        ]);
        return;
      }

      setLoading(true);

      setTimeout(() => {
        const student = {
          ...values,
          name,
          age: Number(values.age),
        };

        if (editingStudent) {
          onUpdate({
            ...student,
            id: editingStudent.id,
          });
        } else {
          onAdd(student);
        }

        setLoading(false);
        form.resetFields();
        onCancel();
      }, 2000);
    });
  };

  return (
    <Modal
      open={open}
      title={
        editingStudent
          ? "Edit Student"
          : "Add Student"
      }
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Student name is required.",
            },
            {
              pattern: /^[A-Za-z ]+$/,
              message:
                "Only alphabets are allowed.",
            },
          ]}
        >
          <TextField
            fullWidth
            label="Student Name"
            variant="outlined"
          />
        </Form.Item>

        <Form.Item
          name="age"
          rules={[
            {
              required: true,
              message: "Age is required.",
            },
            {
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }

                if (
                  value >= 16 &&
                  value <= 60
                ) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error(
                    "Age must be between 16 and 60."
                  )
                );
              },
            },
          ]}
        >
          <TextField
            fullWidth
            type="number"
            label="Age"
          />
        </Form.Item>

        <Form.Item
          name="department"
          rules={[
            {
              required: true,
              message:
                "Please select a department.",
            },
          ]}
        >
          <TextField
            select
            fullWidth
            label="Department"
          >
            {departments.map((department) => (
              <MenuItem
                key={department}
                value={department}
              >
                {department}
              </MenuItem>
            ))}
          </TextField>
        </Form.Item>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          mt={2}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
            disabled={loading}
          >
            Cancel
          </Button>

          <AntButton
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSubmit}
          >
            {loading
              ? "Loading"
              : editingStudent
              ? "Update Student"
              : "Add Student"}
          </AntButton>
        </Stack>
      </Form>
    </Modal>
  );
}