import { Button, Popconfirm, Space, Table } from "antd";

const StudentTable = ({
  students,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  totalStudents,
  onPageChange,
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
      title: "Course",
      render: (_, record) => {
        // Safe check: Handles nested object record.course.name, record.Course, OR record.course
        if (record.course && typeof record.course === "object") {
          return record.course.name || "-";
        }
        return record.Course || record.course || "-";
      },
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Tamil",
      render: (_, record) => {
        // Looks for record.marks.tamil OR record.Tamil OR record.tamil
        return record.marks?.tamil ?? record.Tamil ?? record.tamil ?? "-";
      },
    },
    {
      title: "English",
      render: (_, record) => {
        // Looks for record.marks.english OR record.English OR record.english
        return record.marks?.english ?? record.English ?? record.english ?? "-";
      },
    },
    {
      title: "Maths",
      render: (_, record) => {
        // Looks for record.marks.maths OR record.Maths OR record.maths
        return record.marks?.maths ?? record.Maths ?? record.maths ?? "-";
      },
    },
    {
      title: "Science",
      render: (_, record) => {
        // Looks for record.marks.science OR record.Science OR record.science
        return record.marks?.science ?? record.Science ?? record.science ?? "-";
      },
    },
    {
      title: "Total",
      render: (_, record) => {
        // 1. Check if total is already calculated directly in the database (Total or total)
        const directTotal = record.Total ?? record.total;
        if (directTotal !== undefined && directTotal !== null) {
          return directTotal;
        }

        // 2. If not pre-calculated, calculate it dynamically from nested marks
        if (record.marks) {
          return (
            (record.marks.tamil || 0) +
            (record.marks.english || 0) +
            (record.marks.maths || 0) +
            (record.marks.science || 0)
          );
        }

        // 3. Calculate from top-level flat marks (Capital or lowercase)
        const t = record.Tamil ?? record.tamil ?? 0;
        const e = record.English ?? record.english ?? 0;
        const m = record.Maths ?? record.maths ?? 0;
        const s = record.Science ?? record.science ?? 0;

        // If all marks are missing, return "-"
        if (!t && !e && !m && !s) return "-";

        return t + e + m + s;
      },
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
            description="Are you sure you want to delete this student?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record._id)}
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
      rowKey="_id"
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalStudents,
        showSizeChanger: false,
        onChange: (page) => onPageChange(page),
      }}
    />
  );
};

export default StudentTable;