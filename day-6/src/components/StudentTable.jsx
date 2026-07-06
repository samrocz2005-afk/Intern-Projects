import { Table } from "antd";
import StudentRow from "./StudentRow";

function StudentTable(props) {
  const { students, onDeleteStudent, onToggleAttendance } = props;

  const columns = [
    {
      title: "S.No",
      key: "serialNo",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      key: "name",
      render: (student) => (
        <StudentRow
          student={student}
          type="name"
          onDeleteStudent={onDeleteStudent}
          onToggleAttendance={onToggleAttendance}
        />
      ),
    },
    {
      title: "Roll Number",
      key: "rollNumber",
      render: (student) => (
        <StudentRow
          student={student}
          type="rollNumber"
          onDeleteStudent={onDeleteStudent}
          onToggleAttendance={onToggleAttendance}
        />
      ),
    },
    {
      title: "Department",
      key: "department",
      render: (student) => (
        <StudentRow
          student={student}
          type="department"
          onDeleteStudent={onDeleteStudent}
          onToggleAttendance={onToggleAttendance}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (student) => (
        <StudentRow
          student={student}
          type="status"
          onDeleteStudent={onDeleteStudent}
          onToggleAttendance={onToggleAttendance}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (student) => (
        <StudentRow
          student={student}
          type="actions"
          onDeleteStudent={onDeleteStudent}
          onToggleAttendance={onToggleAttendance}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={students}
      rowKey="id"
      bordered
      pagination={{
        defaultCurrent: 1,
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "15"],
        showQuickJumper: false,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} Students`,
      }}
    />
  );
}

export default StudentTable;
