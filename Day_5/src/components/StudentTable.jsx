import { useState } from "react";

import { Table } from "antd";

import StudentDetails from "./StudentDetails";
import ActionMenu from "./ActionMenu";

export default function StudentTable({
  students,
  onEdit,
  onDelete,
}) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  // Open Student Details Modal
  const handleView = (student) => {
    setSelectedStudent(student);
    setOpenDetails(true);
  };

  // Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 90,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        {
          text: "CSE",
          value: "CSE",
        },
        {
          text: "ECE",
          value: "ECE",
        },
        {
          text: "EEE",
          value: "EEE",
        },
        {
          text: "IT",
          value: "IT",
        },
      ],
      onFilter: (value, record) =>
        record.department === value,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",

      render: (_, record) => (
        <ActionMenu
          student={record}
          onView={handleView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={students}
        bordered
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          showTotal: (total) =>
            `Total ${total} Students`,
        }}
      />

      <StudentDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        student={selectedStudent}
      />
    </>
  );
}