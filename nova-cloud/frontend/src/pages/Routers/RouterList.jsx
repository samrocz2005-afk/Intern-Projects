import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "../../components/common/ConfirmModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchRouters,
  deleteRouter,
} from "../../redux/slices/routerSlice";

import {
  selectRouters,
  selectRoutersLoading,
  selectRoutersError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const RouterList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();

  const routers = useSelector(selectRouters);
  const loading = useSelector(selectRoutersLoading);
  const error = useSelector(selectRoutersError);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { title: "Dashboard", path: "/dashboard" },
      { title: "Routers", path: "/routers" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(fetchRouters());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRouters());
  };

  const handleDeleteClick = (router) => {
    setSelectedRouter(router);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    const id =
      selectedRouter?._id ||
      selectedRouter?.id;

    if (!id) return;

    try {
      setDeleteLoading(true);

      await dispatch(
        deleteRouter(id)
      ).unwrap();

      message.success(
        "Router deleted successfully"
      );

      setDeleteOpen(false);
      setSelectedRouter(null);
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to delete router"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && routers.length === 0) {
    return (
      <Loading
        fullScreen
        tip="Loading routers..."
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
            Routers
          </Title>

          <Text type="secondary">
            Manage routing between your cloud networks.
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
              navigate("/routers/create")
            }
          >
            Create Router
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

      {routers.length === 0 ? (
        <Card>
          <Empty
            image={
              <SwapOutlined
                style={{ fontSize: 48 }}
              />
            }
            description="You don't have any routers yet."
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate("/routers/create")
              }
            >
              Create Router
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {routers.map((router) => {
            const id =
              router._id ||
              router.id;

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
                    navigate(`/routers/${id}`)
                  }
                  actions={[
                    <Button
                      type="link"
                      danger
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteClick(router);
                      }}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <SwapOutlined
                        style={{
                          fontSize: 24,
                        }}
                      />

                      <Typography.Text strong>
                        {router.name ||
                          "Unnamed Router"}
                      </Typography.Text>
                    </Space>

                    <Typography.Text type="secondary">
                      Status:{" "}
                      {router.status ||
                        "Unknown"}
                    </Typography.Text>

                    <Typography.Text type="secondary">
                      Network:{" "}
                      {router.network?.name ||
                        router.networkName ||
                        "Not configured"}
                    </Typography.Text>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Delete Router"
        content={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {selectedRouter?.name ||
                "this router"}
            </strong>
            ?
            <br />
            <br />
            Make sure the router is not required
            by any active network configuration.
          </>
        }
        okText="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteOpen(false);
            setSelectedRouter(null);
          }
        }}
      />
    </div>
  );
};

export default RouterList;