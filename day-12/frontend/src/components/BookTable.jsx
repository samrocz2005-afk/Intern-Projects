import {
  Button,
  Image,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";

const BookTable = ({ books, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Image",
      dataIndex: "image", // Changed from "thumbnail" to match backend mapping
      key: "image",       // Changed from "thumbnail" to match backend mapping
      width: 80,
      render: (imageSrc) => (
        <Image
          src={imageSrc}
          width={50}
          height={70}
          style={{ objectFit: "cover" }}
          fallback="https://via.placeholder.com/150?text=No+Poster"
        />
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Tag color={stock >= 10 ? "green" : "red"}>
          {stock}
        </Tag>
      ),
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
            title="Delete Book"
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
      dataSource={books}
      rowKey="id"
      bordered
      pagination={{
        pageSize: 8,
      }}
    />
  );
};

export default BookTable;