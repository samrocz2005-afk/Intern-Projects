import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
} from "antd";

import { getCourses } from "../api/api";

const { Option } = Select;

const StudentForm = ({ onSubmit, editingStudent }) => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);

  // ==========================
  // Load Courses
  // ==========================
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data.data);
    } catch (error) {
      console.error("Failed to load courses", error);
    }
  };

  // ==========================
  // Edit Student
  // ==========================
  useEffect(() => {
    if (editingStudent) {
      form.setFieldsValue({
        ...editingStudent,
        course: editingStudent.course?._id || editingStudent.course,
        tamil: editingStudent.marks?.tamil,
        english: editingStudent.marks?.english,
        maths: editingStudent.marks?.maths,
        science: editingStudent.marks?.science,
      });
    } else {
      form.resetFields();
    }
  }, [editingStudent, form]);

  // ==========================
  // Submit
  // ==========================
  const handleFinish = (values) => {
    const studentData = {
      name: values.name,
      email: values.email,
      department: values.department,
      age: values.age,
      course: values.course,
      marks: {
        tamil: values.tamil,
        english: values.english,
        maths: values.maths,
        science: values.science,
      },
    };

    onSubmit(studentData);
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required" },
              { min: 3, message: "Minimum 3 characters" },
              {
                pattern: /^[A-Za-z ]+$/,
                message: "Only letters are allowed",
              },
            ]}
          >
            <Input placeholder="Enter Name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Department"
            name="department"
            rules={[
              {
                required: true,
                message: "Select Department",
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
        </Col>

        <Col span={8}>
          <Form.Item
            label="Course"
            name="course"
            rules={[
              {
                required: true,
                message: "Select Course",
              },
            ]}
          >
            <Select placeholder="Select Course">
              {courses.map((course) => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Age is required" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={18}
              max={60}
              placeholder="Enter Age"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="Tamil"
            name="tamil"
            rules={[{ required: true, message: "Required" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
            />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            label="English"
            name="english"
            rules={[{ required: true, message: "Required" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
            />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            label="Maths"
            name="maths"
            rules={[{ required: true, message: "Required" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
            />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            label="Science"
            name="science"
            rules={[{ required: true, message: "Required" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
            />
          </Form.Item>
        </Col>
      </Row>

      <Button type="primary" htmlType="submit">
        {editingStudent ? "Update Student" : "Add Student"}
      </Button>
    </Form>
  );
};

export default StudentForm;