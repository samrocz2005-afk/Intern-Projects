import { useState } from "react";
import {
  Layout,
  Card,
  Divider,
  FloatButton,
  Button,
  Space,
  message,
} from "antd";
import { Typography, Container, Box } from "@mui/material";

import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import DashboardStats from "./components/DashboardStats";

import "./App.css";

const { Header, Content } = Layout;

const initialStudents = [
  {
    id: 1,
    name: "Sam",
    rollNumber: "101",
    department: "Computer Science",
    isPresent: true,
  },
  {
    id: 2,
    name: "Arun",
    rollNumber: "102",
    department: "Information Technology",
    isPresent: false,
  },
  {
    id: 3,
    name: "Priya",
    rollNumber: "103",
    department: "Electronics",
    isPresent: true,
  },
];

function App() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
      return JSON.parse(savedStudents);
    }

    localStorage.setItem("students", JSON.stringify(initialStudents));

    return initialStudents;
  });

  const [openForm, setOpenForm] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Open Modal
  const openAddStudent = () => {
    setOpenForm(true);
  };

  // Add Student
  const addStudent = (student) => {
    const isDuplicate = students.some(
      (item) => item.rollNumber.trim() === student.rollNumber.trim(),
    );

    if (isDuplicate) {
      messageApi.error("Roll Number already exists!");
      return false;
    }

    const updatedStudents = [...students, student];

    setStudents(updatedStudents);

    localStorage.setItem("students", JSON.stringify(updatedStudents));

    sessionStorage.setItem("lastAddedStudent", student.name);

    sessionStorage.setItem("lastAction", "Student Added");

    messageApi.success("Student added successfully!");

    setOpenForm(false);

    return true;
  };

  // Delete Student
  const deleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);

    setStudents(updatedStudents);

    localStorage.setItem("students", JSON.stringify(updatedStudents));

    sessionStorage.setItem("lastAction", "Student Deleted");

    messageApi.success("Student deleted successfully!");
  };

  // Toggle Attendance
  const toggleAttendance = (id) => {
    const updatedStudents = students.map((student) => {
      if (student.id === id) {
        return {
          ...student,
          isPresent: !student.isPresent,
        };
      }

      return student;
    });

    setStudents(updatedStudents);

    localStorage.setItem("students", JSON.stringify(updatedStudents));

    sessionStorage.setItem("lastAction", "Attendance Updated");

    messageApi.success("Attendance updated!");
  };

  return (
    <>
      {contextHolder}

      <Layout className="app-layout">
        <Header className="app-header">
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: "64px",
            }}
          >
            Student Management Dashboard
          </Typography>
        </Header>

        <Content className="app-content">
          <Container maxWidth="lg">
            <Box mt={4}>
              <DashboardStats students={students} />

              <Divider />

              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                  marginBottom: 20,
                }}
              >
                <Button type="primary" size="large" onClick={openAddStudent}>
                  + Add Student
                </Button>
              </Space>

              <Card title=" Student List" className="table-card">
                <StudentTable
                  students={students}
                  onDeleteStudent={deleteStudent}
                  onToggleAttendance={toggleAttendance}
                />
              </Card>

              <Divider />

              <Card title="Session Information">
                <Typography>
                  <strong>Last Added Student:</strong>{" "}
                  {sessionStorage.getItem("lastAddedStudent") || "None"}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  <strong>Last Action:</strong>{" "}
                  {sessionStorage.getItem("lastAction") || "No Action"}
                </Typography>
              </Card>

              <StudentForm
                open={openForm}
                onCancel={() => setOpenForm(false)}
                onAddStudent={addStudent}
              />
            </Box>
          </Container>

          <FloatButton.BackTop />
        </Content>
      </Layout>
    </>
  );
}

export default App;
