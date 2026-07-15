import { useEffect, useState } from "react";
import { Button, Input, Space, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await getStudents();

      setStudents(response.data.data);
      setFilteredStudents(response.data.data);
    } catch (error) {
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, values);
        message.success("Student updated");
      } else {
        await createStudent(values);
        message.success("Student created");
      }

      setOpen(false);
      setSelectedStudent(null);

      loadStudents();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);

      message.success("Student deleted");

      loadStudents();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const handleSearch = (value) => {
    const keyword = value.toLowerCase();

    const filtered = students.filter((student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(keyword)
    );

    setFilteredStudents(filtered);
  };

  return (
    <>
      <Space
        style={{
          marginBottom: 20,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search Student"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedStudent(null);
            setOpen(true);
          }}
        >
          Add Student
        </Button>
      </Space>

      <StudentTable
        students={filteredStudents}
        loading={loading}
        onEdit={(student) => {
          setSelectedStudent(student);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <StudentForm
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleSubmit}
        initialValues={selectedStudent}
      />
    </>
  );
};

export default Students;