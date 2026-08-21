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
  DeleteOutlined,
  ReloadOutlined,
  SwapOutlined,
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
  fetchRouterById,
  deleteRouter,
} from "../../redux/slices/routerSlice";

import {
  selectRouterById,
  selectRoutersLoading,
  selectRoutersError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const RouterDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setBreadcrumbs } =
    useBreadcrumb();

  const router = useSelector(
    (state) =>
      selectRouterById(state, id)
  );

  const loading = useSelector(
    selectRoutersLoading
  );

  const error = useSelector(
    selectRoutersError
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
        title: "Routers",
        path: "/routers",
      },
      {
        title:
          router?.name ||
          "Router Details",
        path: `/routers/${id}`,
      },
    ]);
  }, [
    id,
    router?.name,
    setBreadcrumbs,
  ]);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchRouterById(id)
      );
    }
  }, [dispatch, id]);

  const handleRefresh = () => {
    dispatch(
      fetchRouterById(id)
    );
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await dispatch(
        deleteRouter(id)
      ).unwrap();

      message.success(
        "Router deleted successfully"
      );

      navigate("/routers", {
        replace: true,
      });
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to delete router"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !router) {
    return (
      <Loading
        fullScreen
        tip="Loading router..."
      />
    );
  }

  if (error && !router) {
    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={16}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate("/routers")
          }
        >
          Back to Routers
        </Button>

        <ErrorMessage
          message={error}
          onRetry={handleRefresh}
        />
      </Space>
    );
  }

  if (!router) {
    return (
      <ErrorMessage
        message="Router not found."
        showRetry={false}
      />
    );
  }

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
              navigate("/routers")
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
              <SwapOutlined />
              {router.name ||
                "Router"}
            </Space>
          </Title>

          <Text type="secondary">
            Router ID:{" "}
            {router._id ||
              router.id}
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
        title="Router Information"
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
              status={router.status}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Type">
            <Tag>
              {router.type ||
                "Router"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Gateway">
            {router.gateway ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Network">
            {router.network?.name ||
              router.networkName ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Network ID">
            {router.network?._id ||
              router.networkId ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            {router.description ||
              "No description"}
          </Descriptions.Item>

          <Descriptions.Item label="Created">
            {router.createdAt
              ? new Date(
                  router.createdAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated">
            {router.updatedAt
              ? new Date(
                  router.updatedAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Routing">
        <Descriptions
          column={{
            xs: 1,
            sm: 2,
          }}
        >
          <Descriptions.Item label="Router Status">
            <ResourceStatus
              status={router.status}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Connected Network">
            {router.network?.name ||
              router.networkName ||
              "Not configured"}
          </Descriptions.Item>

          <Descriptions.Item label="Gateway">
            {router.gateway ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Routes">
            {router.routes?.length ??
              router.routeCount ??
              0}
          </Descriptions.Item>
        </Descriptions>

        <Text
          type="secondary"
          style={{
            display: "block",
            marginTop: 12,
          }}
        >
          Routing configuration is controlled
          by the backend. The frontend only
          displays the current router state.
        </Text>
      </Card>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Router"
        content={
          <>
            Are you sure you want to
            delete{" "}
            <strong>
              {router.name ||
                "this router"}
            </strong>
            ?
            <br />
            <br />
            The backend will verify ownership
            and resource dependencies before
            deletion.
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

export default RouterDetails;