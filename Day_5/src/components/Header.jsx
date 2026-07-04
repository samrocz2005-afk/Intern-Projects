import { Row, Col, Input, Select, Button, Typography } from "antd";
import { Add } from "@mui/icons-material";

const { Title } = Typography;

export default function Header({
  searchText,
  setSearchText,
  departmentFilter,
  setDepartmentFilter,
  sortAZ,
  setSortAZ,
  openAddStudent,
}) {
  return (
    <>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={10}>
          <Input
            size="large"
            placeholder="Search Student..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col xs={24} md={6}>
          <Select
            size="large"
            style={{ width: "100%" }}
            value={departmentFilter}
            onChange={setDepartmentFilter}
            options={[
              {
                label: "All Departments",
                value: "All",
              },
              {
                label: "CSE",
                value: "CSE",
              },
              {
                label: "ECE",
                value: "ECE",
              },
              {
                label: "EEE",
                value: "EEE",
              },
              {
                label: "IT",
                value: "IT",
              },
            ]}
          />
        </Col>

        <Col xs={12} md={4}>
          <Button
            block
            size="large"
            onClick={() => setSortAZ(!sortAZ)}
          >
            {sortAZ ? "Clear Sort" : "Sort A-Z"}
          </Button>
        </Col>

        <Col xs={12} md={4}>
          <Button
            type="primary"
            size="large"
            block
            icon={<Add />}
            onClick={openAddStudent}
          >
            Add Student
          </Button>
        </Col>
      </Row>
    </>
  );
}