import React, {
  useEffect,
} from "react";

import {
  Card,
  DatePicker,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Button,
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
  fetchUsage,
} from "../../redux/slices/billingSlice";

import {
  selectUsage,
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

const {
  RangePicker,
} = DatePicker;

const Usage = () => {
  const dispatch = useDispatch();

  const {
    setBreadcrumbs,
  } = useBreadcrumb();

  const usage = useSelector(
    selectUsage
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
        title: "Usage",
        path: "/billing/usage",
      },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(fetchUsage());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsage());
  };

  if (
    loading &&
    usage.length === 0
  ) {
    return (
      <Loading
        fullScreen
        tip="Loading usage..."
      />
    );
  }

  if (
    error &&
    usage.length === 0
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
      title: "Resource",
      key: "resource",

      render: (_, record) =>
        record.resourceName ||
        "Resource",
    },

    {
      title: "Resource Type",
      dataIndex:
        "resourceType",
      key: "resourceType",

      render: (value) => (
        <Tag>
          {value || "Unknown"}
        </Tag>
      ),
    },

    {
      title: "Start",
      dataIndex:
        "usageStart",
      key: "usageStart",

      render: (value) =>
        value
          ? formatDate(value)
          : "N/A",
    },

    {
      title: "End",
      dataIndex:
        "usageEnd",
      key: "usageEnd",

      render: (value) =>
        value
          ? formatDate(value)
          : "N/A",
    },

    {
      title: "Duration",
      dataIndex:
        "durationHours",
      key: "durationHours",

      render: (value) =>
        `${Number(
          value || 0
        ).toFixed(2)} hours`,
    },

    {
      title: "Rate",
      dataIndex:
        "unitPrice",
      key: "unitPrice",

      render: (value) =>
        `${formatCurrency(
          Number(value || 0)
        )} / hr`,
    },

    {
      title: "Charge",
      dataIndex: "amount",
      key: "amount",

      render: (value) =>
        formatCurrency(
          Number(value || 0)
        ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Tag
          color={
            status === "billed"
              ? "green"
              : status === "pending"
              ? "orange"
              : "default"
          }
        >
          {String(
            status || "pending"
          ).toUpperCase()}
        </Tag>
      ),
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
              Usage
            </Title>

            <Text type="secondary">
              Detailed resource usage
              and time-based charges.
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
          <Space
            wrap
            style={{
              marginBottom: 20,
            }}
          >
            <RangePicker />

            <Select
              placeholder="Resource type"
              allowClear
              style={{
                width: 180,
              }}
              options={[
                {
                  value:
                    "instance",
                  label:
                    "Instances",
                },
                {
                  value:
                    "storage",
                  label:
                    "Storage",
                },
                {
                  value:
                    "router",
                  label:
                    "Routers",
                },
                {
                  value:
                    "load_balancer",
                  label:
                    "Load Balancers",
                },
              ]}
            />
          </Space>

          <Table
            rowKey={(record) =>
              record._id
            }
            columns={columns}
            dataSource={usage}
            loading={loading}
            locale={{
              emptyText:
                "No usage records found",
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

        <Card>
          <Text type="secondary">
            Usage duration and charges
            are calculated by the
            backend billing service.
            The frontend only displays
            the returned billing data.
          </Text>
        </Card>
      </Space>
    </div>
  );
};

export default Usage;