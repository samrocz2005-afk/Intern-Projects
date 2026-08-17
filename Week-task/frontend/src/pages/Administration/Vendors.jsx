import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
  StopOutlined,
} from "@ant-design/icons";

import useDebounce from "../../hooks/useDebounce";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function Vendors() {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [vendors] = useState([
    {
      key: "1",
      name: "Tech World",
      owner: "Arun Kumar",
      email: "techworld@example.com",
      products: 45,
      orders: 128,
      commission: 10,
      status: "Approved",
    },
    {
      key: "2",
      name: "Fashion Hub",
      owner: "Priya S",
      email: "fashionhub@example.com",
      products: 68,
      orders: 214,
      commission: 12,
      status: "Approved",
    },
    {
      key: "3",
      name: "Audio Store",
      owner: "Rahul M",
      email: "audiostore@example.com",
      products: 32,
      orders: 86,
      commission: 8,
      status: "Pending",
    },
    {
      key: "4",
      name: "Sports Zone",
      owner: "Karthik R",
      email: "sportszone@example.com",
      products: 54,
      orders: 165,
      commission: 10,
      status: "Approved",
    },
    {
      key: "5",
      name: "Home Essentials",
      owner: "Divya P",
      email: "home@example.com",
      products: 21,
      orders: 42,
      commission: 15,
      status: "Suspended",
    },
  ]);

  const filteredVendors = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return vendors;
    }

    return vendors.filter(
      (vendor) =>
        vendor.name
          .toLowerCase()
          .includes(value) ||
        vendor.owner
          .toLowerCase()
          .includes(value) ||
        vendor.email
          .toLowerCase()
          .includes(value)
    );
  }, [vendors, debouncedSearch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";

      case "Pending":
        return "orange";

      case "Suspended":
        return "red";

      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Vendor",
      key: "vendor",
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<ShopOutlined />}
            style={{
              backgroundColor: "#1677ff",
            }}
          />

          <div>
            <Text strong>{record.name}</Text>

            <br />

            <Text type="secondary">
              {record.owner}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (commission) =>
        `${commission}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          icon={
            status === "Approved" ? (
              <CheckCircleOutlined />
            ) : status === "Suspended" ? (
              <StopOutlined />
            ) : null
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button
          type="text"
          icon={<EyeOutlined />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs items={[{label: "Administration"},{ label: "Vendors / Sellers" }]} />

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Vendors / Sellers
            </Title>

            <Text type="secondary">
              Manage vendors, approvals, commissions, and payouts.
            </Text>
          </div>

          <Space wrap>
            <Input
              allowClear
              placeholder="Search vendors"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{ width: 230 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Vendor
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredVendors}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </>
  );
}

export default Vendors;