import { Button, Popconfirm, Space, Table } from "antd";

const StudentTable = ({
  students,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Student?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={students}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default StudentTable;