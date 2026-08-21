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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalStudents, setTotalStudents] = useState(0);

  // ==========================
  // Fetch Students
  // ==========================
  const fetchStudents = async () => {
    try {
      const res = await getStudents(
        currentPage,
        pageSize,
        search,
        filter
      );

      setStudents(res.data.data);
      setTotalStudents(res.data.totalStudents);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, search, filter]);

  // ==========================
  // Search Change
  // ==========================
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // ==========================
  // Department Filter Change
  // ==========================
  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  // ==========================
  // Add / Update Student
  // ==========================
  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, values);
        message.success("Student Updated");
      } else {
        await addStudent(values);
        message.success("Student Added");
      }

      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error(error);
      message.error("Operation Failed");
    }
  };

  // ==========================
  // Edit Student
  // ==========================
  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  // ==========================
  // Delete Student
  // ==========================
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      message.success("Student Deleted");

      fetchStudents();
    } catch (error) {
      console.error(error);
      message.error("Delete Failed");
    }
  };

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

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col>
            <SearchBar
              search={search}
              setSearch={handleSearchChange}
            />
          </Col>

          <Col>
            <FilterBar
              filter={filter}
              setFilter={handleFilterChange}
            />
          </Col>
        </Row>

        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          pageSize={pageSize}
          totalStudents={totalStudents}
          onPageChange={setCurrentPage}
        />
      </Content>
    </Layout>
  );
}

export default App;