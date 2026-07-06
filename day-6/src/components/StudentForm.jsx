import { useState } from "react";
import { Modal, Input, Select, Button } from "antd";
import { Typography } from "@mui/material";

const { Option } = Select;

const emptyStudent = {
  name: "",
  rollNumber: "",
  department: "",
};

function StudentForm({ open, onCancel, onAddStudent }) {
  const [student, setStudent] = useState(emptyStudent);

  const [errors, setErrors] = useState(emptyStudent);

  const updateError = (field, value = "") =>
    setErrors((prev) => ({ ...prev, [field]: value }));

  const handleInputChange = ({ target: { name, value } }) => {
    setStudent((prev) => ({ ...prev, [name]: value }));
    updateError(name);
  };

  const handleDepartmentChange = (value) => {
    setStudent((prev) => ({ ...prev, department: value }));
    updateError("department");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!student.name.trim()) newErrors.name = "Student Name is required.";
    else if (!/^[A-Za-z ]+$/.test(student.name))
      newErrors.name = "Only letters are allowed.";

    if (!student.rollNumber.trim())
      newErrors.rollNumber = "Roll Number is required.";
    else if (!/^[0-9]+$/.test(student.rollNumber))
      newErrors.rollNumber = "Only numbers are allowed.";

    if (!student.department)
      newErrors.department = "Please select a department.";

    setErrors({
      ...emptyStudent,
      ...newErrors,
    });

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setStudent(emptyStudent);
    setErrors(emptyStudent);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const added = onAddStudent({
      id: Date.now(),
      ...student,
      name: student.name.trim(),
      rollNumber: student.rollNumber.trim(),
      isPresent: false,
    });

    if (added) resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const renderError = (error) =>
    error && (
      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
        {error}
      </Typography>
    );

  const isFormValid =
    student.name.trim() && student.rollNumber.trim() && student.department;

  return (
    <Modal
      title="Add Student"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Student Details
      </Typography>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <Input
            size="large"
            name="name"
            placeholder="Enter Student Name"
            value={student.name}
            onChange={handleInputChange}
            status={errors.name && "error"}
          />
          {renderError(errors.name)}
        </div>

        <div style={{ marginBottom: 20 }}>
          <Input
            size="large"
            name="rollNumber"
            placeholder="Enter Roll Number"
            value={student.rollNumber}
            onChange={handleInputChange}
            status={errors.rollNumber && "error"}
          />
          {renderError(errors.rollNumber)}
        </div>

        <div style={{ marginBottom: 20 }}>
          <Select
            size="large"
            placeholder="Select Department"
            style={{ width: "100%" }}
            value={student.department || undefined}
            onChange={handleDepartmentChange}
            status={errors.department && "error"}
          >
            <Option value="Computer Science">Computer Science</Option>
            <Option value="Information Technology">
              Information Technology
            </Option>
            <Option value="Electronics">Electronics</Option>
            <Option value="Mechanical">Mechanical</Option>
            <Option value="Civil">Civil</Option>
          </Select>

          {renderError(errors.department)}
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          disabled={!isFormValid}
        >
          Add Student
        </Button>
      </form>
    </Modal>
  );
}

export default StudentForm;
