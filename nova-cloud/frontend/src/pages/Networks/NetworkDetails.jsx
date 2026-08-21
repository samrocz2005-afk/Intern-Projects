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
  GlobalOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ConfirmModal from "../../components/common/ConfirmModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import ResourceStatus from "../../components/resources/ResourceStatus";

import {
  fetchNetwork,
  deleteNetwork,
} from "../../redux/slices/networkSlice";

import {
  selectNetworkById,
  selectNetworksLoading,
  selectNetworksError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const NetworkDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setBreadcrumbs } =
    useBreadcrumb();

  const network = useSelector(
    (state) =>
      selectNetworkById(
        state,
        id
      )
  );

  const loading = useSelector(
    selectNetworksLoading
  );

  const error = useSelector(
    selectNetworksError
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
        title: "Networks",
        path: "/networks",
      },
      {
        title:
          network?.name ||
          "Network Details",
        path: `/networks/${id}`,
      },
    ]);
  }, [
    id,
    network?.name,
    setBreadcrumbs,
  ]);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchNetwork(id)
      );
    }
  }, [dispatch, id]);

  const handleRefresh = () => {
    dispatch(
      fetchNetwork(id)
    );
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await dispatch(
        deleteNetwork(id)
      ).unwrap();

      message.success(
        "Network deleted successfully"
      );

      navigate("/networks", {
        replace: true,
      });
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to delete network"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !network) {
    return (
      <Loading
        fullScreen
        tip="Loading network..."
      />
    );
  }

  if (error && !network) {
    return (
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size={16}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate("/networks")
          }
        >
          Back to Networks
        </Button>

        <ErrorMessage
          message={error}
          onRetry={handleRefresh}
        />
      </Space>
    );
  }

  if (!network) {
    return (
      <ErrorMessage
        message="Network not found."
        showRetry={false}
      />
    );
  }

  const instanceCount =
    network.instances?.length ??
    network.instanceCount ??
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
              navigate("/networks")
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
              <GlobalOutlined />
              {network.name ||
                "Network"}
            </Space>
          </Title>

          <Text type="secondary">
            Network ID:{" "}
            {network._id ||
              network.id}
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
        title="Network Information"
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
              status={network.status}
            />
          </Descriptions.Item>

          <Descriptions.Item label="CIDR">
            <Tag>
              {network.cidr ||
                "N/A"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Gateway">
            {network.gateway ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Instances">
            {instanceCount}
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            {network.description ||
              "No description"}
          </Descriptions.Item>

          <Descriptions.Item label="Created">
            {network.createdAt
              ? new Date(
                  network.createdAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated">
            {network.updatedAt
              ? new Date(
                  network.updatedAt
                ).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Resource Usage">
        <Descriptions
          column={{
            xs: 1,
            sm: 2,
          }}
        >
          <Descriptions.Item label="Connected Instances">
            {instanceCount}
          </Descriptions.Item>

          <Descriptions.Item label="Network Type">
            <Tag>
              {network.type ||
                "Private"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <Text
          type="secondary"
          style={{
            display: "block",
            marginTop: 12,
          }}
        >
          A network cannot safely be
          deleted while resources still
          depend on it. The backend
          ownership and dependency checks
          are authoritative.
        </Text>
      </Card>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Network"
        content={
          <>
            Are you sure you want to
            delete{" "}
            <strong>
              {network.name ||
                "this network"}
            </strong>
            ?
            <br />
            <br />
            Any resources still attached
            to this network may prevent
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

export default NetworkDetails;