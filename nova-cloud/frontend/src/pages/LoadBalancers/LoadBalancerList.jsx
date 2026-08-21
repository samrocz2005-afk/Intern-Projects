import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "../../components/common/ConfirmModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchLoadBalancers,
  deleteLoadBalancer,
} from "../../redux/slices/loadBalancerSlice";

import {
  selectLoadBalancers,
  selectLoadBalancersLoading,
  selectLoadBalancersError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const LoadBalancerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();

  const loadBalancers = useSelector(
    selectLoadBalancers
  );

  const loading = useSelector(
    selectLoadBalancersLoading
  );

  const error = useSelector(
    selectLoadBalancersError
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedLoadBalancer, setSelectedLoadBalancer] =
    useState(null);
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
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(fetchLoadBalancers());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchLoadBalancers());
  };

  const handleDeleteClick = (loadBalancer) => {
    setSelectedLoadBalancer(loadBalancer);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    const id =
      selectedLoadBalancer?._id ||
      selectedLoadBalancer?.id;

    if (!id) return;

    try {
      setDeleteLoading(true);

      await dispatch(
        deleteLoadBalancer(id)
      ).unwrap();

      message.success(
        "Load balancer deleted successfully"
      );

      setDeleteOpen(false);
      setSelectedLoadBalancer(null);
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
    loadBalancers.length === 0
  ) {
    return (
      <Loading
        fullScreen
        tip="Loading load balancers..."
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Load Balancers
          </Title>

          <Text type="secondary">
            Distribute incoming traffic across
            your cloud instances.
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

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              navigate(
                "/load-balancers/create"
              )
            }
          >
            Create Load Balancer
          </Button>
        </Space>
      </div>

      {error && (
        <div style={{ marginBottom: 16 }}>
          <ErrorMessage
            message={error}
            onRetry={handleRefresh}
          />
        </div>
      )}

      {loadBalancers.length === 0 ? (
        <Card>
          <Empty
            image={
              <CloudServerOutlined
                style={{ fontSize: 48 }}
              />
            }
            description={
              "You don't have any load balancers yet."
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate(
                  "/load-balancers/create"
                )
              }
            >
              Create Load Balancer
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {loadBalancers.map(
            (loadBalancer) => {
              const id =
                loadBalancer._id ||
                loadBalancer.id;

              return (
                <Col
                  key={id}
                  xs={24}
                  sm={12}
                  lg={8}
                  xl={6}
                >
                  <Card
                    hoverable
                    onClick={() =>
                      navigate(
                        `/load-balancers/${id}`
                      )
                    }
                    actions={[
                      <Button
                        type="link"
                        danger
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClick(
                            loadBalancer
                          );
                        }}
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <Space
                      direction="vertical"
                      size={12}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Space>
                        <CloudServerOutlined
                          style={{
                            fontSize: 24,
                          }}
                        />

                        <Text strong>
                          {loadBalancer.name ||
                            "Unnamed Load Balancer"}
                        </Text>
                      </Space>

                      <Text type="secondary">
                        Status:{" "}
                        {loadBalancer.status ||
                          "Unknown"}
                      </Text>

                      <Text type="secondary">
                        Algorithm:{" "}
                        {loadBalancer.algorithm ||
                          "Round Robin"}
                      </Text>

                      <Text type="secondary">
                        Port:{" "}
                        {loadBalancer.port ||
                          "N/A"}
                      </Text>

                      <Tag
                        color={
                          loadBalancer.status ===
                          "active"
                            ? "green"
                            : "default"
                        }
                      >
                        {loadBalancer.status ||
                          "unknown"}
                      </Tag>
                    </Space>
                  </Card>
                </Col>
              );
            }
          )}
        </Row>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Delete Load Balancer"
        content={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {selectedLoadBalancer?.name ||
                "this load balancer"}
            </strong>
            ?
            <br />
            <br />
            Make sure there are no production
            services depending on this load balancer.
          </>
        }
        okText="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteOpen(false);
            setSelectedLoadBalancer(null);
          }
        }}
      />
    </div>
  );
};

export default LoadBalancerList;