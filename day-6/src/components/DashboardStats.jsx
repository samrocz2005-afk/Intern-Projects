import { Card, Row, Col, Statistic } from "antd";
import { Typography } from "@mui/material";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

function DashboardStats({ students }) {
  const totalStudents = students.length;

  const presentStudents = students.filter(
    (student) => student.isPresent,
  ).length;

  const absentStudents = totalStudents - presentStudents;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={8}>
        <Card hoverable>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Total Students
          </Typography>

          <Statistic
            value={totalStudents}
            valueStyle={{
              color: "#1677ff",
            }}
            prefix={<TeamOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card hoverable>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Present Students
          </Typography>

          <Statistic
            value={presentStudents}
            valueStyle={{
              color: "#52c41a",
            }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card hoverable>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Absent Students
          </Typography>

          <Statistic
            value={absentStudents}
            valueStyle={{
              color: "#ff4d4f",
            }}
            prefix={<CloseCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default DashboardStats;
