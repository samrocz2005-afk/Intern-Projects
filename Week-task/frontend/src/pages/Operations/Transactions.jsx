import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Input,
  Statistic,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  DollarOutlined,
  SearchOutlined,
  SyncOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import Breadcrumbs from "../../components/Breadcrumbs";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Transactions() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  const fetchTransactionsData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/transactions");
      
      const result = response.data.data?.transactions || response.data.transactions || response.data.data || response.data || [];

      const formattedTransactions = result.map((item, index) => {
        let formattedDate = "N/A";
        if (item.createdAt || item.date) {
          const dateObj = new Date(item.createdAt || item.date);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString("en-GB").replace(/\//g, "-");
          }
        }

        const cust = item.customer || item.order?.customer;
        const customerName = cust
          ? `${cust.firstName || ""} ${cust.lastName || ""}`.trim()
          : "N/A";

        return {
          key: item._id || item.transactionId || String(index + 1),
          orderId: item.order?.orderNumber || "N/A",
          customer: customerName || cust?.email || "N/A",
          amount: item.amount ?? 0,
          method: item.paymentMethod || "Online",
          status: item.paymentStatus || item.status || "Pending",
          date: formattedDate,
        };
      });

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Fetch Transactions Error Details:", error.response || error);
      message.error(
        error.response?.data?.message || "Failed to fetch transactions data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const filteredTransactions = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return transactions;
    }

    return transactions.filter(
      (transaction) =>
        transaction.orderId.toLowerCase().includes(value) ||
        transaction.customer.toLowerCase().includes(value) ||
        transaction.method.toLowerCase().includes(value)
    );
  }, [transactions, debouncedSearch]);

  // Support both "Completed" and "Paid" statuses
  const paidTransactions = transactions.filter(
    (transaction) => transaction.status === "Completed" || transaction.status === "Paid"
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "Pending" || transaction.status === "Processing"
  );

  const refundedTransactions = transactions.filter(
    (transaction) => transaction.status === "Refunded" || transaction.status === "Completed"
  );

  const totalRevenue = paidTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "Paid":
        return "green";
      case "Pending":
      case "Processing":
        return "orange";
      case "Refunded":
      case "Failed":
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount.toLocaleString("en-IN")}`,
    },
    {
      title: "Payment Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Operations & Sales" },
          { label: "Transaction / Payments" },
        ]}
      />
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "4px" }}>
          Transactions / Payments
        </Title>
        <Text type="secondary">
          Monitor payments, transactions, payouts, and refunds.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₹"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed / Paid"
              value={paidTransactions.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={pendingTransactions.length}
              prefix={<SyncOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Refunded"
              value={refundedTransactions.length}
              prefix={<UndoOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Payment Transactions"
        style={{ marginTop: "16px" }}
        extra={
          <Input
            allowClear
            placeholder="Search transactions"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 240 }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}

export default Transactions;