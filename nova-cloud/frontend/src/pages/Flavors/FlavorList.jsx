import React, { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  fetchFlavors,
  deleteFlavor,
  updateFlavorStatus,
} from "../../redux/slices/flavorSlice";

const { Title, Text } = Typography;

const FlavorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items,
    loading,
    actionLoading,
    error,
    pagination,
  } = useSelector(
    (state) => state.flavors
  );

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Flavors
  |--------------------------------------------------------------------------
  */

  const loadFlavors = () => {
    dispatch(
      fetchFlavors({
        page: 1,
        limit: 100,
        search,
      })
    );
  };

  useEffect(() => {
    loadFlavors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearch = () => {
    dispatch(
      fetchFlavors({
        page: 1,
        limit: 100,
        search: search.trim(),
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id) => {
    const result = await dispatch(
      deleteFlavor(id)
    );

    if (
      deleteFlavor.fulfilled.match(result)
    ) {
      message.success(
        "Flavor deleted successfully"
      );
    } else {
      message.error(
        result.payload?.message ||
          "Failed to delete flavor"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    record
  ) => {
    const id =
      record._id || record.id;

    const result = await dispatch(
      updateFlavorStatus({
        id,
        isActive: !record.isActive,
      })
    );

    if (
      updateFlavorStatus.fulfilled.match(
        result
      )
    ) {
      message.success(
        record.isActive
          ? "Flavor disabled"
          : "Flavor activated"
      );
    } else {
      message.error(
        result.payload?.message ||
          "Failed to update flavor status"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Table Columns
  |--------------------------------------------------------------------------
  */

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (value) => (
        <Text strong>
          {value || "-"}
        </Text>
      ),
    },

    {
      title: "vCPU",
      key: "vcpus",
      dataIndex: "vcpus",
      align: "center",
      render: (value) =>
        `${value ?? 0}`,
    },

    {
      title: "RAM",
      key: "ram",
      dataIndex: "ram",
      align: "center",
      render: (value) =>
        `${value ?? 0} GB`,
    },

    {
      title: "Disk",
      key: "disk",
      dataIndex: "disk",
      align: "center",
      render: (value) =>
        `${value ?? 0} GB`,
    },

    {
      title: "Hourly",
      key: "hourlyPrice",
      dataIndex: "hourlyPrice",
      render: (value) =>
        `₹${Number(value || 0).toFixed(4)}`,
    },

    {
      title: "Monthly",
      key: "monthlyPrice",
      dataIndex: "monthlyPrice",
      render: (value) =>
        value !== null &&
        value !== undefined
          ? `₹${Number(value).toFixed(2)}`
          : "-",
    },

    {
      title: "Status",
      key: "isActive",
      dataIndex: "isActive",
      align: "center",
      render: (isActive) => (
        <Tag
          color={
            isActive
              ? "green"
              : "red"
          }
        >
          {isActive
            ? "ACTIVE"
            : "INACTIVE"}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const id =
          record._id || record.id;

        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(
                  `/flavors/${id}`
                )
              }
            >
              View
            </Button>

            <Button
              icon={<EditOutlined />}
              onClick={() =>
                navigate(
                  `/flavors/${id}?edit=true`
                )
              }
            >
              Edit
            </Button>

            <Button
              onClick={() =>
                handleStatusChange(
                  record
                )
              }
              loading={actionLoading}
            >
              {record.isActive
                ? "Disable"
                : "Enable"}
            </Button>

            <Popconfirm
              title="Delete this flavor?"
              description="This action cannot be undone."
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{
                danger: true,
              }}
              onConfirm={() =>
                handleDelete(id)
              }
            >
              <Button
                danger
                icon={
                  <DeleteOutlined />
                }
                loading={
                  actionLoading
                }
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      <Card>
        <Space
          direction="vertical"
          size="large"
          style={{
            width: "100%",
          }}
        >
          {/* Header */}

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
                level={3}
                style={{
                  margin: 0,
                }}
              >
                Flavors
              </Title>

              <Text type="secondary">
                Manage compute resource
                configurations.
              </Text>
            </div>

            <Space>
              <Button
                icon={
                  <ReloadOutlined />
                }
                onClick={loadFlavors}
              >
                Refresh
              </Button>

              <Button
                type="primary"
                icon={
                  <PlusOutlined />
                }
                onClick={() =>
                  navigate(
                    "/flavors/create"
                  )
                }
              >
                Create Flavor
              </Button>
            </Space>
          </div>

          {/* Search */}

          <Space
            style={{
              width: "100%",
            }}
          >
            <Input
              placeholder="Search flavors..."
              prefix={
                <SearchOutlined />
              }
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              onPressEnter={
                handleSearch
              }
              allowClear
              style={{
                width: 320,
              }}
            />

            <Button
              type="primary"
              onClick={
                handleSearch
              }
            >
              Search
            </Button>
          </Space>

          {/* Error */}

          {error && (
            <Alert
              type="error"
              showIcon
              title={error}
            />
          )}

          {/* Table */}

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                padding: 50,
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <Table
              rowKey={(record) =>
                record._id ||
                record.id
              }
              columns={columns}
              dataSource={items}
              pagination={{
                current:
                  pagination?.page ||
                  1,
                pageSize:
                  pagination?.limit ||
                  20,
                total:
                  pagination?.total ||
                  items.length,
                showSizeChanger: true,
                showTotal: (total) =>
                  `Total ${total} flavors`,
              }}
              scroll={{
                x: 1000,
              }}
            />
          )}
        </Space>
      </Card>
    </div>
  );
};

export default FlavorList;