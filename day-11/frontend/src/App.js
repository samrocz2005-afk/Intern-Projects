import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col, message } from "antd";

import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "./api/api";

import "antd/dist/reset.css";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // ==========================
  // Fetch Students
  // ==========================
  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      message.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================
  // Add / Update
  // ==========================
  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, values);
        message.success("Student Updated");
      } else {
        await addStudent(values);
        message.success("Student Added");
      }

      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      message.error("Operation Failed");
    }
  };

  // ==========================
  // Edit
  // ==========================
  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  // ==========================
  // Delete
  // ==========================
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      message.success("Student Deleted");
      fetchStudents();
    } catch (error) {
      message.error("Delete Failed");
    }
  };

  // ==========================
  // Search + Filter
  // ==========================
  const filteredStudents = students.filter((student) => {
    const matchSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || student.department === filter;

    return matchSearch && matchFilter;
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Title
          level={2}
          style={{
            color: "#fff",
            margin: "12px 0",
          }}
        >
          Student Management
        </Title>
      </Header>

      <Content style={{ padding: 30 }}>
        <StudentForm
          onSubmit={handleSubmit}
          editingStudent={editingStudent}
        />

        <Row
          gutter={16}
          style={{ marginBottom: 20 }}
        >
          <Col>
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
          </Col>

          <Col>
            <FilterBar
              filter={filter}
              setFilter={setFilter}
            />
          </Col>
        </Row>

        <StudentTable
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Content>
    </Layout>
  );
}

export default App;