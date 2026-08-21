import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CloudServerOutlined,
  DeleteOutlined,
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
  fetchLoadBalancer,
  deleteLoadBalancer,
} from "../../redux/slices/loadBalancerSlice";

import {
  selectLoadBalancerById,
  selectLoadBalancersLoading,
  selectLoadBalancersError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const LoadBalancerDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setBreadcrumbs } =
    useBreadcrumb();

  const loadBalancer = useSelector(
    (state) =>
      selectLoadBalancerById(
        state,
        id
      )
  );

  const loading = useSelector(
    selectLoadBalancersLoading
  );

  const error = useSelector(
    selectLoadBalancersError
  );

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Dashboard",
        path: "/dashboard",
      },
      {
        title: "Load Balancers",
        path: "/load-balancers",
      },
      {
        title:
          loadBalancer?.name ||
          "Load Balancer Details",
        path: `/load-balancers/${id}`,
      },
    ]);
  }, [
    id,
    loadBalancer?.name,
    setBreadcrumbs,
  ]);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchLoadBalancer(id)
      );
    }
  }, [dispatch, id]);

  const handleRefresh = () => {
    dispatch(
      fetchLoadBalancer(id)
    );
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await dispatch(
        deleteLoadBalancer(id)
      ).unwrap();

      message.success(
        "Load balancer deleted successfully"
      );

      navigate("/load-balancers", {
        replace: true,
      });
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to delete load balancer"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (
    loading &&
    !loadBalancer
  ) {
    return (
      <Loading
        fullScreen
        tip="Loading load balancer..."
      />
    );
  }

  if (
    error &&
    !loadBalancer
  ) {
    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={16}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate(
              "/load-balancers"
            )
          }
        >
          Back to Load Balancers
        </Button>

        <ErrorMessage
          message={error}
          onRetry={handleRefresh}
        />
      </Space>
    );
  }

  if (!loadBalancer) {
    return (
      <ErrorMessage
        message="Load balancer not found."
        showRetry={false}
      />
    );
  }

  const backendCount =
    loadBalancer.backends?.length ??
    loadBalancer.instances?.length ??
    loadBalancer.backendCount ??
    0;

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
              navigate(
                "/load-balancers"
              )
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
              <CloudServerOutlined />
              {loadBalancer.name ||
                "Load Balancer"}
            </Space>
          </Title>

          <Text type="secondary">
            Load Balancer ID:{" "}
            {loadBalancer._id ||
              loadBalancer.id}
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
        title="Load Balancer Information"
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
              status={loadBalancer.status}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Protocol">
            <Tag>
              {String(
                loadBalancer.protocol ||
                  "HTTP"
              ).toUpperCase()}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Algorithm">
            {loadBalancer.algorithm ||
              "Round Robin"}
          </Descriptions.Item>

          <Descriptions.Item label="Port">
            {loadBalancer.port ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Backend Instances">
            {backendCount}
          </Descriptions.Item>

          <Descriptions.Item label="Network">
            {loadBalancer.network?.name ||
              loadBalancer.networkName ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            {loadBalancer.description ||
              "No description"}
          </Descriptions.Item>

          <Descriptions.Item label="Created">
            {loadBalancer.createdAt
              ? new Date(
                  loadBalancer.createdAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated">
            {loadBalancer.updatedAt
              ? new Date(
                  loadBalancer.updatedAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Backend Instances"
        style={{ marginBottom: 16 }}
      >
        {loadBalancer.backends?.length > 0 ? (
          <Space
            direction="vertical"
            style={{ width: "100%" }}
          >
            {loadBalancer.backends.map(
              (backend, index) => (
                <Card
                  size="small"
                  key={
                    backend._id ||
                    backend.id ||
                    index
                  }
                >
                  <Flex
                    justify="space-between"
                    align="center"
                  >
                    <Space>
                      <CloudServerOutlined />

                      <Text strong>
                        {backend.instance?.name ||
                          backend.instanceName ||
                          backend.name ||
                          `Backend ${index + 1}`}
                      </Text>
                    </Space>

                    <Tag>
                      {backend.status ||
                        "Unknown"}
                    </Tag>
                  </Flex>
                </Card>
              )
            )}
          </Space>
        ) : (
          <Text type="secondary">
            No backend instances are attached.
          </Text>
        )}
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
              {loadBalancer.billingStatus ||
                "Active"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Rate">
            {loadBalancer.hourlyPrice != null
              ? `₹${Number(
                  loadBalancer.hourlyPrice
                ).toFixed(2)} / hour`
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
          Final billing is calculated by
          the backend billing service using
          usage records and the configured
          pricing model.
        </Text>
      </Card>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Load Balancer"
        content={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {loadBalancer.name ||
                "this load balancer"}
            </strong>
            ?
            <br />
            <br />
            The backend will verify ownership
            and dependency state before deletion.
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

export default LoadBalancerDetails;