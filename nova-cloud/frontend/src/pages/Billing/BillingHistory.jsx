import React, { useEffect } from "react";

import {
  Button,
  Card,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import {
  ReloadOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchBillingHistory,
} from "../../redux/slices/billingSlice";

import {
  selectBillingHistory,
  selectBillingLoading,
  selectBillingError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const {
  Title,
  Text,
} = Typography;

const BillingHistory = () => {
  const dispatch = useDispatch();

  const {
    setBreadcrumbs,
  } = useBreadcrumb();

  const history = useSelector(
    selectBillingHistory
  );

  const loading = useSelector(
    selectBillingLoading
  );

  const error = useSelector(
    selectBillingError
  );

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
        title: "Billing History",
        path: "/billing/history",
      },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(fetchBillingHistory());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(
      fetchBillingHistory()
    );
  };

  if (
    loading &&
    history.length === 0
  ) {
    return (
      <Loading
        fullScreen
        tip="Loading billing history..."
      />
    );
  }

  if (
    error &&
    history.length === 0
  ) {
    return (
      <ErrorMessage
        message={error}
        onRetry={handleRefresh}
      />
    );
  }

  const columns = [
    {
      title: "Invoice",
      key: "invoiceNumber",
      render: (_, record) =>
        record.invoiceNumber ||
        record._id ||
        "Billing Record",
    },

    {
      title: "Billing Period",
      key: "billingPeriod",

      render: (_, record) => (
        <Space
          orientation="vertical"
          size={0}
        >
          <Text>
            {record.billingPeriodStart
              ? formatDate(
                  record.billingPeriodStart
                )
              : "N/A"}
          </Text>

          <Text type="secondary">
            {record.billingPeriodEnd
              ? formatDate(
                  record.billingPeriodEnd
                )
              : "N/A"}
          </Text>
        </Space>
      ),
    },

    {
      title: "Resources",
      key: "resources",

      render: (_, record) =>
        Array.isArray(
          record.items
        )
          ? record.items.length
          : 0,
    },

    {
      title: "Usage",
      key: "usage",

      render: (_, record) => {
        const usageHours =
          (record.items || []).reduce(
            (sum, item) =>
              sum +
              Number(
                item.quantity || 0
              ),
            0
          );

        return `${usageHours.toFixed(
          2
        )} hrs`;
      },
    },

    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",

      render: (value) =>
        formatCurrency(
          Number(value || 0)
        ),
    },

    {
      title: "Total",
      dataIndex: "total",
      key: "total",

      render: (value) => (
        <Text strong>
          {formatCurrency(
            Number(value || 0)
          )}
        </Text>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => {
        const normalized =
          String(
            status || "pending"
          ).toLowerCase();

        let color = "default";

        if (
          normalized === "paid"
        ) {
          color = "green";
        } else if (
          normalized === "pending"
        ) {
          color = "orange";
        } else if (
          normalized === "failed" ||
          normalized ===
            "cancelled"
        ) {
          color = "red";
        }

        return (
          <Tag color={color}>
            {normalized.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",

      render: (value) =>
        value
          ? formatDate(value)
          : "N/A",
    },
  ];

  return (
    <div>
      <Space
        orientation="vertical"
        size={24}
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
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
              Billing History
            </Title>

            <Text type="secondary">
              View your previous cloud
              billing records and
              charges.
            </Text>
          </div>

          <Button
            icon={
              <ReloadOutlined />
            }
            onClick={
              handleRefresh
            }
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <Card>
          <Table
            rowKey={(record) =>
              record._id ||
              record.invoiceNumber
            }
            columns={columns}
            dataSource={history}
            loading={loading}
            locale={{
              emptyText:
                "No billing records found",
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            scroll={{
              x: true,
            }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default BillingHistory;