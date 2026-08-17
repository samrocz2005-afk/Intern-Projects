import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Input,
  Rate,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Breadcrumbs from "../../components/Breadcrumbs";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Reviews() {
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // ==================================================
  // FETCH REVIEWS FROM BACKEND
  // ==================================================
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews");
      const data = response?.data?.data || response?.data || [];

      const formatted = Array.isArray(data)
        ? data.map((item) => {
            const createdAt = item.createdAt ? new Date(item.createdAt) : null;
            const customerName = item.customer
              ? `${item.customer.firstName || ""} ${item.customer.lastName || ""}`.trim()
              : item.customerName || "Anonymous";

            const productName = item.product?.name || item.productName || "N/A";

            return {
              ...item,
              key: item._id || item.id,
              customer: customerName || "Anonymous",
              product: productName,
              rating: item.rating || 0,
              review: item.comment || item.review || "",
              status: item.isApproved ? "Approved" : "Pending",
              date: createdAt ? createdAt.toLocaleDateString() : "-",
            };
          })
        : [];

      setReviews(formatted);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      message.error(
        error.response?.data?.message || "Failed to load product reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ==================================================
  // APPROVE / REJECT REVIEW HANDLERS
  // ==================================================
  const handleUpdateStatus = async (id, approve) => {
    try {
      await api.patch(`/reviews/${id}/status`, { isApproved: approve });
      message.success(
        approve ? "Review approved successfully" : "Review rejected"
      );
      setReviews((prev) =>
        prev.map((item) =>
          item.key === id
            ? { ...item, status: approve ? "Approved" : "Rejected", isApproved: approve }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update review status:", error);
      message.error(
        error.response?.data?.message || "Failed to update review status"
      );
    }
  };

  // ==================================================
  // FILTER REVIEWS
  // ==================================================
  const filteredReviews = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return reviews;
    }

    return reviews.filter(
      (review) =>
        review.customer.toLowerCase().includes(value) ||
        review.product.toLowerCase().includes(value) ||
        review.review.toLowerCase().includes(value)
    );
  }, [reviews, debouncedSearch]);

  // ==================================================
  // TABLE COLUMNS
  // ==================================================
  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{record.customer}</Text>
        </Space>
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Rate disabled value={rating} style={{ fontSize: 16 }} />
      ),
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      render: (review) => (
        <Text ellipsis={{ tooltip: review }}>{review}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Approved"
              ? "green"
              : status === "Rejected"
              ? "red"
              : "orange"
          }
          icon={status === "Approved" ? <CheckCircleOutlined /> : null}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const reviewId = record._id || record.key;
        const isApproved = record.status === "Approved";

        return (
          <Space size="small">
            {!isApproved && (
              <Button
                type="text"
                size="small"
                style={{ color: "#52c41a" }}
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(reviewId, true)}
              >
                Approve
              </Button>
            )}
            {isApproved && (
              <Button
                type="text"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleUpdateStatus(reviewId, false)}
              >
                Reject
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card>
      <Breadcrumbs
        items={[
          { label: "Marketing" },
          { label: "Reviews & Ratings" },
        ]}
      />
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
            Reviews & Ratings
          </Title>
          <Text type="secondary">
            Moderate product reviews and customer feedback.
          </Text>
        </div>

        <Input
          allowClear
          placeholder="Search reviews"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: 240 }}
        />
      </div>

      <Table
        rowKey={(record) => record._id || record.key}
        columns={columns}
        dataSource={filteredReviews}
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
        }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}

export default Reviews;