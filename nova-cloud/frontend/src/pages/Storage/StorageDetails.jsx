import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Progress,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  HddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ConfirmModal from "../../components/common/ConfirmModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import ResourceStatus from "../../components/resources/ResourceStatus";

import {
  fetchStorageById,
  deleteStorage,
} from "../../redux/slices/storageSlice";

import {
  selectStorageById,
  selectStorageLoading,
  selectStorageError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const StorageDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setBreadcrumbs } =
    useBreadcrumb();

  const storage = useSelector(
    (state) =>
      selectStorageById(state, id)
  );

  const loading = useSelector(
    selectStorageLoading
  );

  const error = useSelector(
    selectStorageError
  );

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Dashboard",
        path: "/dashboard",
      },
      {
        title: "Storage",
        path: "/storage",
      },
      {
        title:
          storage?.name ||
          "Storage Details",
        path: `/storage/${id}`,
      },
    ]);
  }, [
    id,
    storage?.name,
    setBreadcrumbs,
  ]);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchStorageById(id)
      );
    }
  }, [dispatch, id]);

  const handleRefresh = () => {
    dispatch(
      fetchStorageById(id)
    );
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await dispatch(
        deleteStorage(id)
      ).unwrap();

      message.success(
        "Storage deleted successfully"
      );

      navigate("/storage", {
        replace: true,
      });
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to delete storage"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !storage) {
    return (
      <Loading
        fullScreen
        tip="Loading storage..."
      />
    );
  }

  if (error && !storage) {
    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={16}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate("/storage")
          }
        >
          Back to Storage
        </Button>

        <ErrorMessage
          message={error}
          onRetry={handleRefresh}
        />
      </Space>
    );
  }

  if (!storage) {
    return (
      <ErrorMessage
        message="Storage volume not found."
        showRetry={false}
      />
    );
  }

  const capacity = Number(
    storage.size ??
      storage.capacity ??
      0
  );

  const used = Number(
    storage.used ?? 0
  );

  const usage =
    capacity > 0
      ? Math.min(
          Math.round(
            (used / capacity) * 100
          ),
          100
        )
      : 0;

  const attachedInstance =
    storage.instance?.name ||
    storage.instanceName ||
    null;

  return (
    <div>
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={16}
      >
        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              navigate("/storage")
            }
          >
            Back
          </Button>

          <Title
            level={2}
            style={{
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            <Space>
              <HddOutlined />
              {storage.name ||
                "Storage"}
            </Space>
          </Title>

          <Text type="secondary">
            Storage ID:{" "}
            {storage._id ||
              storage.id}
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              setDeleteOpen(true)
            }
          >
            Delete
          </Button>
        </Space>
      </Flex>

      <Divider />

      <Card
        title="Storage Information"
        style={{ marginBottom: 16 }}
      >
        <Descriptions
          bordered
          column={{
            xs: 1,
            sm: 2,
            lg: 3,
          }}
        >
          <Descriptions.Item label="Status">
            <ResourceStatus
              status={storage.status}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Type">
            <Tag>
              {storage.type ||
                "Volume"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Capacity">
            {capacity}{" "}
            {storage.unit || "GB"}
          </Descriptions.Item>

          <Descriptions.Item label="Used">
            {used}{" "}
            {storage.unit || "GB"}
          </Descriptions.Item>

          <Descriptions.Item label="Available">
            {Math.max(
              capacity - used,
              0
            )}{" "}
            {storage.unit || "GB"}
          </Descriptions.Item>

          <Descriptions.Item label="Attached To">
            {attachedInstance ||
              "Not attached"}
          </Descriptions.Item>

          <Descriptions.Item label="Created">
            {storage.createdAt
              ? new Date(
                  storage.createdAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated">
            {storage.updatedAt
              ? new Date(
                  storage.updatedAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Storage Usage"
        style={{ marginBottom: 16 }}
      >
        <Progress
          percent={usage}
          status={
            usage >= 90
              ? "exception"
              : "active"
          }
        />

        <Text type="secondary">
          {used} GB used of {capacity} GB
        </Text>
      </Card>

      <Card title="Billing">
        <Descriptions
          column={{
            xs: 1,
            sm: 2,
          }}
        >
          <Descriptions.Item label="Billing Status">
            <Tag>
              {storage.billingStatus ||
                "Active"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Storage Rate">
            {storage.hourlyPrice != null
              ? `₹${Number(
                  storage.hourlyPrice
                ).toFixed(2)} / hour`
              : storage.monthlyPrice != null
              ? `₹${Number(
                  storage.monthlyPrice
                ).toFixed(2)} / month`
              : "Calculated by billing service"}
          </Descriptions.Item>
        </Descriptions>

        <Text
          type="secondary"
          style={{
            display: "block",
            marginTop: 12,
          }}
        >
          Final charges are calculated
          by the backend billing service
          from the applicable storage
          rate and recorded usage.
        </Text>
      </Card>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Storage"
        content={
          <>
            Are you sure you want to
            delete{" "}
            <strong>
              {storage.name ||
                "this storage"}
            </strong>
            ?
            <br />
            <br />
            Make sure this volume is not
            attached to an instance.
          </>
        }
        okText="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteOpen(false);
          }
        }}
      />
    </div>
  );
};

export default StorageDetails;