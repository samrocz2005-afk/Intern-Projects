import { useMemo, useState } from "react";

import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Statistic,
  notification,
} from "antd";

import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import StudentForm from "./components/StudentForm";

const { Header: AppHeader, Content } = Layout;
const { Title } = Typography;

const initialStudents = [
  { id: 1, name: "Sam", age: 22, department: "CSE" },
  { id: 2, name: "Arun", age: 21, department: "ECE" },
  { id: 3, name: "Priya", age: 20, department: "IT" },
  { id: 4, name: "Karthik", age: 23, department: "EEE" },
  { id: 5, name: "Divya", age: 22, department: "CSE" },
  { id: 6, name: "Sooriya", age: 22, department: "IT" },
  { id: 7, name: "Kamal", age: 22, department: "CSE" },
];

export default function App() {
  const [students, setStudents] = useState(initialStudents);

  const [searchText, setSearchText] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [sortAZ, setSortAZ] = useState(false);

  const [openForm, setOpenForm] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);

  const [api, contextHolder] = notification.useNotification();

  // Search + Filter + Sort
  const filteredStudents = useMemo(() => {
    let data = [...students];

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();

      data = data.filter(
        (student) =>
          student.name.toLowerCase().includes(keyword) ||
          student.department.toLowerCase().includes(keyword) ||
          student.id.toString().includes(keyword)
      );
    }

    if (departmentFilter !== "All") {
      data = data.filter(
        (student) => student.department === departmentFilter
      );
    }

    if (sortAZ) {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [students, searchText, departmentFilter, sortAZ]);

  // Average Age
  const averageAge = useMemo(() => {
    if (!filteredStudents.length) return 0;

    const total = filteredStudents.reduce(
      (sum, student) => sum + student.age,
      0
    );

    return (total / filteredStudents.length).toFixed(1);
  }, [filteredStudents]);

  // Add Student
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id:
        students.length > 0
          ? Math.max(...students.map((item) => item.id)) + 1
          : 1,
    };

    setStudents((prev) => [...prev, newStudent]);

    api.success({
      message: "Student Added Successfully",
    });
  };

  // Update Student
  const updateStudent = (student) => {
    setStudents((prev) =>
      prev.map((item) =>
        item.id === student.id ? student : item
      )
    );

    api.success({
      message: "Student Updated Successfully",
    });
  };

  // Delete Student
  const deleteStudent = (id) => {
    setStudents((prev) =>
      prev.filter((student) => student.id !== id)
    );

    api.success({
      message: "Student Deleted Successfully",
    });
  };

  // Edit Student
  const editStudent = (student) => {
    setEditingStudent(student);
    setOpenForm(true);
  };

  // Open Add Modal
  const openAddStudent = () => {
    setEditingStudent(null);
    setOpenForm(true);
  };

  return (
    <>
      {contextHolder}

      <Layout style={{ minHeight: "100vh" }}>
        {/* Top Blue Header */}
        <AppHeader
          style={{
            background: "#1677ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title
            level={2}
            style={{
              color: "#fff",
              margin: 0,
            }}
          >
            Student Management System
          </Title>
        </AppHeader>

        <Content style={{ padding: 24 }}>
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%" }}
          >
            {/* Search / Filter / Buttons */}
            <Header
              searchText={searchText}
              setSearchText={setSearchText}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              sortAZ={sortAZ}
              setSortAZ={setSortAZ}
              openAddStudent={openAddStudent}
            />

            {/* Statistics */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card>
                  <Statistic
                    title="Total Students"
                    value={filteredStudents.length}
                  />
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card>
                  <Statistic
                    title="Average Age"
                    value={averageAge}
                  />
                </Card>
              </Col>
            </Row>

            {/* Student Table */}
            <StudentTable
              students={filteredStudents}
              onEdit={editStudent}
              onDelete={deleteStudent}
            />
          </Space>

          {/* Add / Edit Form */}
          <StudentForm
            open={openForm}
            onCancel={() => setOpenForm(false)}
            onAdd={addStudent}
            onUpdate={updateStudent}
            editingStudent={editingStudent}
            students={students}
          />
        </Content>
      </Layout>
    </>
  );
}