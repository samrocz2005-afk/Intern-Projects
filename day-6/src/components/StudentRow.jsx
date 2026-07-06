import { Button, Tag, Space } from "antd";
import { Typography } from "@mui/material";

function StudentRow(props) {
  const { student, type, onDeleteStudent, onToggleAttendance } = props;

  if (type === "name") {
    return <Typography variant="body1">{student.name}</Typography>;
  }

  if (type === "rollNumber") {
    return <Typography variant="body1">{student.rollNumber}</Typography>;
  }

  if (type === "department") {
    return <Typography variant="body1">{student.department}</Typography>;
  }

  if (type === "status") {
    return student.isPresent ? (
      <Tag color="green">Present</Tag>
    ) : (
      <Tag color="red">Absent</Tag>
    );
  }

  if (type === "actions") {
    return (
      <Space>
        <Button
          type={student.isPresent ? "default" : "primary"}
          onClick={() => onToggleAttendance(student.id)}
        >
          {student.isPresent ? "Mark Absent" : "Mark Present"}
        </Button>

        <Button danger onClick={() => onDeleteStudent(student.id)}>
          Delete
        </Button>
      </Space>
    );
  }

  return null;
}

export default StudentRow;
