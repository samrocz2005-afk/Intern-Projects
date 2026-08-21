import React, {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  fetchFlavor,
  updateFlavor,
  deleteFlavor,
  updateFlavorStatus,
} from "../../redux/slices/flavorSlice";

const { Title, Text } = Typography;

const FlavorDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const [searchParams] =
    useSearchParams();

  const [form] =
    Form.useForm();

  const [editing, setEditing] =
    useState(
      searchParams.get("edit") === "true"
    );

  const {
    selectedFlavor,
    loading,
    actionLoading,
    error,
  } = useSelector(
    (state) => state.flavors
  );

  /*
  |--------------------------------------------------------------------------
  | Load Flavor
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchFlavor(id));
  }, [dispatch, id]);

  /*
  |--------------------------------------------------------------------------
  | Populate Form
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedFlavor) {
      return;
    }

    const selectedId =
      selectedFlavor._id ||
      selectedFlavor.id;

    if (
      String(selectedId) !==
      String(id)
    ) {
      return;
    }

    form.setFieldsValue({
      name:
        selectedFlavor.name || "",

      description:
        selectedFlavor.description || "",

      vcpus:
        selectedFlavor.vcpus,

      ram:
        selectedFlavor.ram,

      disk:
        selectedFlavor.disk,

      hourlyPrice:
        selectedFlavor.hourlyPrice,

      monthlyPrice:
        selectedFlavor.monthlyPrice,
    });
  }, [
    selectedFlavor,
    id,
    form,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Update Flavor
  |--------------------------------------------------------------------------
  */

  const handleUpdate = async (
    values
  ) => {
    const result = await dispatch(
      updateFlavor({
        id,
        data: {
          name:
            values.name?.trim(),

          description:
            values.description?.trim() ||
            "",

          vcpus:
            values.vcpus,

          ram:
            values.ram,

          disk:
            values.disk,

          hourlyPrice:
            values.hourlyPrice,

          monthlyPrice:
            values.monthlyPrice ??
            null,
        },
      })
    );

    if (
      updateFlavor.fulfilled.match(
        result
      )
    ) {
      message.success(
        "Flavor updated successfully"
      );

      setEditing(false);
    } else {
      message.error(
        result.payload ||
          "Failed to update flavor"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Change Status
  |--------------------------------------------------------------------------
  */

  const handleStatus = async () => {
    if (!selectedFlavor || !id) {
      return;
    }

    const result = await dispatch(
      updateFlavorStatus({
        id,
        isActive:
          !selectedFlavor.isActive,
      })
    );

    if (
      updateFlavorStatus.fulfilled.match(
        result
      )
    ) {
      message.success(
        selectedFlavor.isActive
          ? "Flavor disabled"
          : "Flavor activated"
      );
    } else {
      message.error(
        result.payload ||
          "Failed to update flavor status"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Flavor
  |--------------------------------------------------------------------------
  */

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    const result = await dispatch(
      deleteFlavor(id)
    );

    if (
      deleteFlavor.fulfilled.match(
        result
      )
    ) {
      message.success(
        "Flavor deleted successfully"
      );

      navigate("/flavors", {
        replace: true,
      });
    } else {
      message.error(
        result.payload ||
          "Failed to delete flavor"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (
    loading &&
    !selectedFlavor
  ) {
    return (
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Not Found / Error
  |--------------------------------------------------------------------------
  */

  if (
    !loading &&
    !selectedFlavor
  ) {
    return (
      <Card>
        <Alert
          type="error"
          showIcon
          title={
            error ||
            "Flavor not found"
          }
        />

        <Button
          type="link"
          icon={
            <ArrowLeftOutlined />
          }
          onClick={() =>
            navigate("/flavors")
          }
          style={{
            paddingLeft: 0,
            marginTop: 16,
          }}
        >
          Back to Flavors
        </Button>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      <Card>
        <Space
          orientation="vertical"
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
              alignItems:
                "flex-start",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <Button
                type="link"
                icon={
                  <ArrowLeftOutlined />
                }
                onClick={() =>
                  navigate(
                    "/flavors"
                  )
                }
                style={{
                  paddingLeft: 0,
                }}
              >
                Back to Flavors
              </Button>

              <Title
                level={3}
                style={{
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                {selectedFlavor.name}
              </Title>

              <Text type="secondary">
                Flavor configuration
                details
              </Text>
            </div>

            <Space>
              {!editing && (
                <Button
                  type="primary"
                  icon={
                    <EditOutlined />
                  }
                  onClick={() =>
                    setEditing(true)
                  }
                >
                  Edit
                </Button>
              )}

              <Button
                onClick={
                  handleStatus
                }
                loading={
                  actionLoading
                }
              >
                {selectedFlavor.isActive
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
                onConfirm={
                  handleDelete
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
          </div>

          {error && (
            <Alert
              type="error"
              showIcon
              title={error}
            />
          )}

          <Divider />

          {/* Edit Mode */}

          {editing ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={
                handleUpdate
              }
              style={{
                maxWidth: 700,
              }}
            >
              <Form.Item
                label="Flavor Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter a flavor name",
                  },
                  {
                    min: 2,
                    message:
                      "Flavor name must contain at least 2 characters",
                  },
                  {
                    max: 100,
                    message:
                      "Flavor name cannot exceed 100 characters",
                  },
                ]}
              >
                <Input
                  maxLength={100}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
              >
                <Input.TextArea
                  rows={4}
                  maxLength={300}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label="vCPUs"
                name="vcpus"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter vCPU count",
                  },
                  {
                    type: "number",
                    min: 1,
                    message:
                      "vCPU must be at least 1",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  precision={0}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="RAM (GB)"
                name="ram"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter RAM",
                  },
                  {
                    type: "number",
                    min: 1,
                    message:
                      "RAM must be at least 1 GB",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Disk (GB)"
                name="disk"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter disk size",
                  },
                  {
                    type: "number",
                    min: 1,
                    message:
                      "Disk must be at least 1 GB",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Hourly Price"
                name="hourlyPrice"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter hourly price",
                  },
                  {
                    type: "number",
                    min: 0,
                    message:
                      "Price cannot be negative",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  precision={4}
                  step={0.0001}
                  prefix="₹"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Monthly Price"
                name="monthlyPrice"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    message:
                      "Price cannot be negative",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  prefix="₹"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    onClick={() =>
                      setEditing(false)
                    }
                    disabled={
                      actionLoading
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={
                      <SaveOutlined />
                    }
                    loading={
                      actionLoading
                    }
                  >
                    Save Changes
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            /* View Mode */

            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
              }}
            >
              <Descriptions.Item label="Name">
                {selectedFlavor.name}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedFlavor.isActive
                      ? "green"
                      : "red"
                  }
                >
                  {selectedFlavor.isActive
                    ? "ACTIVE"
                    : "INACTIVE"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Description">
                {selectedFlavor.description ||
                  "No description"}
              </Descriptions.Item>

              <Descriptions.Item label="vCPU">
                {selectedFlavor.vcpus}
              </Descriptions.Item>

              <Descriptions.Item label="RAM">
                {selectedFlavor.ram} GB
              </Descriptions.Item>

              <Descriptions.Item label="Disk">
                {selectedFlavor.disk} GB
              </Descriptions.Item>

              <Descriptions.Item label="Hourly Price">
                ₹
                {Number(
                  selectedFlavor.hourlyPrice ||
                    0
                ).toFixed(4)}
              </Descriptions.Item>

              <Descriptions.Item label="Monthly Price">
                {selectedFlavor.monthlyPrice !==
                  null &&
                selectedFlavor.monthlyPrice !==
                  undefined
                  ? `₹${Number(
                      selectedFlavor.monthlyPrice
                    ).toFixed(2)}`
                  : "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Created">
                {selectedFlavor.createdAt
                  ? new Date(
                      selectedFlavor.createdAt
                    ).toLocaleString()
                  : "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Updated">
                {selectedFlavor.updatedAt
                  ? new Date(
                      selectedFlavor.updatedAt
                    ).toLocaleString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default FlavorDetails;