import React, { useEffect } from "react";

import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";

import {
  CloudServerOutlined,
  DatabaseOutlined,
  DollarOutlined,
  ReloadOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import { fetchBillingOverview } from "../../redux/slices/billingSlice";

import {
  selectBillingOverview,
  selectBillingLoading,
  selectBillingError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const { Title, Text } = Typography;

const BillingOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setBreadcrumbs } = useBreadcrumb();

  /*
  |--------------------------------------------------------------------------
  | Authenticated User
  |--------------------------------------------------------------------------
  */

  const user = useSelector((state) => state.auth?.user);

  /*
  |--------------------------------------------------------------------------
  | Normalize Role
  |--------------------------------------------------------------------------
  */

  const role = String(user?.role || "user").toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | Redux Billing
  |--------------------------------------------------------------------------
  */

  const overview = useSelector(selectBillingOverview);

  const loading = useSelector(selectBillingLoading);

  const error = useSelector(selectBillingError);

  /*
  |--------------------------------------------------------------------------
  | Breadcrumbs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Dashboard",
        path: "/dashboard",
      },
      {
        title: "Billing",
        path: "/billing",
      },
      {
        title: "Overview",
        path: "/billing",
      },
    ]);
  }, [setBreadcrumbs]);

  /*
  |--------------------------------------------------------------------------
  | Load Billing
  |--------------------------------------------------------------------------
  |
  | USER  -> billingApi.getBilling()
  | ADMIN -> billingApi.getAllBilling()
  |
  | The role now comes from the authenticated Redux user.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!user) {
      return;
    }

    dispatch(
      fetchBillingOverview({
        role,
      }),
    );
  }, [dispatch, user, role]);

  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const handleRefresh = () => {
    dispatch(
      fetchBillingOverview({
        role,
      }),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading && !overview) {
    return <Loading fullScreen tip="Loading billing overview..." />;
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error && !overview) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  /*
  |--------------------------------------------------------------------------
  | Overview Data
  |--------------------------------------------------------------------------
  */

  const stats = overview || {};

  const recentCharges = Array.isArray(stats.recentCharges)
    ? stats.recentCharges
    : [];

  /*
  |--------------------------------------------------------------------------
  | Recent Charges Columns
  |--------------------------------------------------------------------------
  */

  const columns = [
    {
      title: "Resource",
      key: "resource",

      render: (_, record) => (
        <Space>
          <CloudServerOutlined />

          <span>{record.resourceName || "Resource"}</span>
        </Space>
      ),
    },

    {
      title: "Type",
      dataIndex: "resourceType",
      key: "resourceType",

      render: (value) => <Tag>{String(value || "Resource").toUpperCase()}</Tag>,
    },

    {
      title: "Usage",
      dataIndex: "usage",
      key: "usage",

      render: (value) => {
        if (value === null || value === undefined) {
          return "N/A";
        }

        return `${Number(value).toFixed(2)} hours`;
      },
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",

      render: (value) => formatCurrency(Number(value || 0)),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => {
        const normalizedStatus = String(status || "pending").toLowerCase();

        let color = "orange";

        if (normalizedStatus === "paid") {
          color = "green";
        }

        if (normalizedStatus === "failed") {
          color = "red";
        }

        if (normalizedStatus === "cancelled") {
          color = "default";
        }

        return <Tag color={color}>{normalizedStatus.toUpperCase()}</Tag>;
      },
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",

      render: (value) => (value ? formatDate(value) : "N/A"),
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      <Space
        direction="vertical"
        size={24}
        style={{
          width: "100%",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
              }}
            >
              Billing Overview
            </Title>

            <Text type="secondary">
              {role === "admin"
                ? "Monitor all users' cloud usage and billing charges."
                : "Monitor your cloud usage and billing charges."}
            </Text>
          </div>

          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>

            <Button onClick={() => navigate("/billing/usage")}>
              View Usage
            </Button>

            <Button type="primary" onClick={() => navigate("/billing/history")}>
              Billing History
            </Button>
          </Space>
        </div>

        {/* Statistics */}

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Current Balance"
                value={stats.currentBalance ?? 0}
                prefix={<WalletOutlined />}
                formatter={(value) => formatCurrency(Number(value || 0))}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Current Month"
                value={stats.currentMonthTotal ?? 0}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value || 0))}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Resources"
                value={stats.activeResources ?? 0}
                prefix={<CloudServerOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Usage"
                value={stats.totalUsageHours ?? 0}
                precision={2}
                suffix="hours"
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Charges */}

        <Card
          title="Recent Charges"
          extra={
            <Text type="secondary">
              {recentCharges.length} charge
              {recentCharges.length === 1 ? "" : "s"}
            </Text>
          }
        >
          <Table
            rowKey={(record) =>
              record._id || `${record.billingId}-${record.resource}`
            }
            columns={columns}
            dataSource={recentCharges}
            loading={loading}
            locale={{
              emptyText: "No billing charges found",
            }}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
            scroll={{
              x: 800,
            }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default BillingOverview;
