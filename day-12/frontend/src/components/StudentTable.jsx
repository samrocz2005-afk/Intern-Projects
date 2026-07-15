import { Button, Popconfirm, Space, Table, Tag } from "antd";

const StudentTable = ({ students, onEdit, onDelete }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <Tag color={gender === "male" ? "blue" : "magenta"}>
          {gender?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Student"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
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
      bordered
      pagination={{
        pageSize: 10,
      }}
    />
  );
};

export default StudentTable;