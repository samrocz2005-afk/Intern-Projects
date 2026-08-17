import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Input,
  Row,
  Col,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PlusOutlined,
  RollbackOutlined,
  SearchOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function ReturnsRefunds() {
  const navigate = useNavigate();

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    refundAmount: 0,
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debouncedSearch = useDebounce(search.trim(), 500);

  const fetchReturns = useCallback(
    async (page = 1, limit = 10, searchQuery = "") => {
      try {
        setLoading(true);

        const response = await api.get("/returns", {
          params: {
            page,
            limit,
            search: searchQuery.trim(),
          },
        });

        const responseData = response?.data;
        const result = responseData?.data || responseData || {};

        const returnsArray =
          result?.returns ||
          result?.logs ||
          (Array.isArray(result) ? result : []);

        const paginationData = result?.pagination || {};
        const statisticsData = result?.stats || {};

        const formattedReturns = Array.isArray(returnsArray)
          ? returnsArray.map((item, index) => ({
              ...item,
              key:
                item?._id ||
                item?.returnId ||
                item?.key ||
                `return-${index}`,
            }))
          : [];

        setReturns(formattedReturns);

        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: limit,
          total: Number(
            paginationData?.total ?? formattedReturns.length
          ),
        }));

        setStats({
          total: Number(
            statisticsData?.total ??
              paginationData?.total ??
              formattedReturns.length
          ),
          pending: Number(statisticsData?.pending || 0),
          processing: Number(statisticsData?.processing || 0),
          completed: Number(statisticsData?.completed || 0),
          refundAmount: Number(statisticsData?.refundAmount || 0),
        });
      } catch (error) {
        setReturns([]);
        message.error(
          error.response?.data?.message ||
            "Failed to fetch returns and refunds"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const { current, pageSize } = pagination;

  useEffect(() => {
    fetchReturns(current, pageSize, debouncedSearch);
  }, [fetchReturns, current, pageSize, debouncedSearch]);

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    
    fetchReturns(
      newPagination.current,
      newPagination.pageSize,
      debouncedSearch
    );
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "blue";
      case "Pending":
        return "orange";
      case "Processing":
        return "cyan";
      case "Completed":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleOutlined />;
      case "Pending":
        return <ClockCircleOutlined />;
      default:
        return null;
    }
  };

  const getCustomerName = (customer) => {
    if (!customer) return "N/A";
    if (typeof customer === "string") return customer.trim() || "N/A";
    if (typeof customer === "object") {
      if (customer.name) return String(customer.name).trim();
      const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
      return fullName || customer.email || customer.phone || "N/A";
    }
    return "N/A";
  };

  const getProductName = (product) => {
    if (!product) return "N/A";
    if (typeof product === "string") return product.trim() || "N/A";
    if (typeof product === "object") {
      return product.name?.trim() || product.title?.trim() || "N/A";
    }
    return "N/A";
  };

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) return "₹0";
    return `₹${numericAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date, record) => {
    const value = date || record?.createdAt;
    if (!value) return "-";
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString("en-IN");
  };

  const columns = [
    {
      title: "Return ID",
      dataIndex: "returnId",
      key: "returnId",
      render: (id, record) => (
        <Text strong style={{ color: "#1677ff", cursor: "pointer" }}>
          {id || record?._id || record?.key || "N/A"}
        </Text>
      ),
      onCell: (record) => ({
        style: { cursor: "pointer" },
        onClick: () => {
          navigate(`/returns/${record._id || record.returnId}`, {
            state: { from: "/returns" },
          });
        },
      }),
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => {
        if (!orderId) return "N/A";
        if (typeof orderId === "object") {
          return orderId.orderNumber || orderId._id || "N/A";
        }
        return String(orderId);
      },
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => getCustomerName(customer),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product) => getProductName(product),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => reason?.trim() || "N/A",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const normalizedType = type?.trim() || "N/A";
        const isRefund = normalizedType === "Refund";
        return (
          <Tag color={isRefund ? "purple" : "blue"} icon={isRefund ? <RollbackOutlined /> : <SwapOutlined />}>
            {normalizedType}
          </Tag>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatAmount(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const normalizedStatus = status?.trim() || "Pending";
        return (
          <Tag color={getStatusColor(normalizedStatus)} icon={getStatusIcon(normalizedStatus)}>
            {normalizedStatus}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date, record) => formatDate(date, record),
    },
  ];

  return (
    <div>
      <Breadcrumbs />
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Returns & Refunds
          </Title>
          <Text type="secondary">
            Process product returns, refunds, and exchange requests.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/returns/Create-Return")}
        >
          Create Return
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Returns"
              value={stats.total}
              prefix={<RollbackOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Processing"
              value={stats.processing}
              prefix={<RollbackOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Refunded Amount"
              value={stats.refundAmount}
              prefix={<DollarOutlined />}
              formatter={(value) =>
                `₹${Number(value || 0).toLocaleString("en-IN")}`
              }
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Returns Table */}
      <Card
        title="Return Requests"
        style={{ marginTop: "16px" }}
        extra={
          <Space wrap>
            <Input
              allowClear
              maxLength={100}
              placeholder="Search returns"
              prefix={<SearchOutlined />}
              value={search}
              onChange={handleSearchChange}
              style={{ width: 240 }}
            />
            <Tag color="green">Completed: {stats.completed}</Tag>
          </Space>
        }
      >
        <Table
          rowKey={(record) =>
            record.key || record._id || record.returnId
          }
          columns={columns}
          dataSource={returns}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} returns`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}

export default ReturnsRefunds;