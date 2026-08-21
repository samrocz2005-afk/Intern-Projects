import React, {
  useEffect,
  useState,
} from "react";

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
  PlayCircleOutlined,
  PoweroffOutlined,
  ReloadOutlined,
  CloudServerOutlined,
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
  fetchInstance,
  deleteInstance,
  startInstance,
  stopInstance,
} from "../../redux/slices/instanceSlice";

import {
  selectInstanceById,
  selectInstancesLoading,
  selectInstancesError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } =
  Typography;

const InstanceDetails =
  () => {
    const {
      id,
    } = useParams();

    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const {
      setBreadcrumbs,
    } = useBreadcrumb();

    const instance =
      useSelector(
        (state) =>
          selectInstanceById(
            state,
            id
          )
      );

    const loading =
      useSelector(
        selectInstancesLoading
      );

    const error =
      useSelector(
        selectInstancesError
      );

    const [
      actionLoading,
      setActionLoading,
    ] = useState(false);

    const [
      confirmAction,
      setConfirmAction,
    ] = useState(null);

    useEffect(() => {
      setBreadcrumbs([
        {
          title: "Dashboard",
          path: "/dashboard",
        },
        {
          title: "Instances",
          path: "/instances",
        },
        {
          title:
            instance?.name ||
            "Instance Details",
          path: `/instances/${id}`,
        },
      ]);
    }, [
      id,
      instance?.name,
      setBreadcrumbs,
    ]);

    useEffect(() => {
      if (id) {
        dispatch(
          fetchInstance(id)
        );
      }
    }, [dispatch, id]);

    const handleRefresh =
      () => {
        dispatch(
          fetchInstance(id)
        );
      };

    const executeAction =
      async () => {
        if (!confirmAction) {
          return;
        }

        try {
          setActionLoading(
            true
          );

          if (
            confirmAction ===
            "delete"
          ) {
            await dispatch(
              deleteInstance(id)
            ).unwrap();

            message.success(
              "Instance deleted successfully"
            );

            navigate(
              "/instances",
              {
                replace: true,
              }
            );

            return;
          }

          if (
            confirmAction ===
            "start"
          ) {
            await dispatch(
              startInstance(id)
            ).unwrap();

            message.success(
              "Instance start requested"
            );
          }

          if (
            confirmAction ===
            "stop"
          ) {
            await dispatch(
              stopInstance(id)
            ).unwrap();

            message.success(
              "Instance stop requested"
            );
          }

          setConfirmAction(null);

          dispatch(
            fetchInstance(id)
          );
        } catch (error) {
          message.error(
            error?.message ||
              "Operation failed"
          );
        } finally {
          setActionLoading(
            false
          );
        }
      };

    if (
      loading &&
      !instance
    ) {
      return (
        <Loading
          fullScreen
          tip="Loading instance..."
        />
      );
    }

    if (error && !instance) {
      return (
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
          size={16}
        >
          <Button
            icon={
              <ArrowLeftOutlined />
            }
            onClick={() =>
              navigate(
                "/instances"
              )
            }
          >
            Back to Instances
          </Button>

          <ErrorMessage
            message={error}
            onRetry={
              handleRefresh
            }
          />
        </Space>
      );
    }

    if (!instance) {
      return (
        <ErrorMessage
          message="Instance not found."
          showRetry={false}
        />
      );
    }

    const instanceStatus =
      String(
        instance.status ||
          ""
      ).toLowerCase();

    const canStart =
      [
        "stopped",
        "inactive",
      ].includes(
        instanceStatus
      );

    const canStop =
      [
        "running",
        "active",
      ].includes(
        instanceStatus
      );

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
              icon={
                <ArrowLeftOutlined />
              }
              onClick={() =>
                navigate(
                  "/instances"
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
                {instance.name ||
                  "Instance"}
              </Space>
            </Title>

            <Text type="secondary">
              Instance ID:{" "}
              {instance._id ||
                instance.id}
            </Text>
          </div>

          <Space wrap>
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

            {canStart && (
              <Button
                type="primary"
                icon={
                  <PlayCircleOutlined />
                }
                onClick={() =>
                  setConfirmAction(
                    "start"
                  )
                }
              >
                Start
              </Button>
            )}

            {canStop && (
              <Button
                icon={
                  <PoweroffOutlined />
                }
                onClick={() =>
                  setConfirmAction(
                    "stop"
                  )
                }
              >
                Stop
              </Button>
            )}

            <Button
              danger
              icon={
                <DeleteOutlined />
              }
              onClick={() =>
                setConfirmAction(
                  "delete"
                )
              }
            >
              Delete
            </Button>
          </Space>
        </Flex>

        <Divider />

        <Card
          title="Instance Information"
          loading={
            loading &&
            !instance
          }
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
                status={
                  instance.status
                }
              />
            </Descriptions.Item>

            <Descriptions.Item label="Flavor">
              {instance.flavor
                ?.name ||
                instance.flavorName ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Image">
              {instance.image ||
                instance.imageName ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Network">
              {instance.network
                ?.name ||
                instance.networkName ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Private IP">
              {instance.privateIp ||
                instance.privateIP ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Public IP">
              {instance.publicIp ||
                instance.publicIP ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="vCPU">
              {instance.flavor
                ?.vcpus ??
                instance.vcpu ??
                instance.cpu ??
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Memory">
              {instance.flavor
                ?.memory
                ? `${instance.flavor.memory} GB`
                : instance.memory
                ? `${instance.memory} GB`
                : "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Storage">
              {instance.storageSize
                ? `${instance.storageSize} GB`
                : "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Created">
              {instance.createdAt
                ? new Date(
                    instance.createdAt
                  ).toLocaleString()
                : "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Updated">
              {instance.updatedAt
                ? new Date(
                    instance.updatedAt
                  ).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title="Billing"
          style={{
            marginTop: 16,
          }}
        >
          <Descriptions
            column={{
              xs: 1,
              sm: 2,
            }}
          >
            <Descriptions.Item label="Hourly Rate">
              {instance.flavor
                ?.hourlyPrice !=
              null
                ? `₹${Number(
                    instance.flavor
                      .hourlyPrice
                  ).toFixed(2)} / hour`
                : "Calculated by billing service"}
            </Descriptions.Item>

            <Descriptions.Item label="Billing Status">
              <Tag>
                {instance.billingStatus ||
                  "Active"}
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
            Final billing is calculated
            by the backend using the
            selected flavor and recorded
            usage time.
          </Text>
        </Card>

        <ConfirmModal
          open={
            Boolean(
              confirmAction
            )
          }
          title={
            confirmAction ===
            "delete"
              ? "Delete Instance"
              : confirmAction ===
                "start"
              ? "Start Instance"
              : "Stop Instance"
          }
          content={
            confirmAction ===
            "delete"
              ? `Are you sure you want to delete ${
                  instance.name ||
                  "this instance"
                }? This action cannot be undone.`
              : confirmAction ===
                "start"
              ? `Start ${
                  instance.name ||
                  "this instance"
                }?`
              : `Stop ${
                  instance.name ||
                  "this instance"
                }?`
          }
          okText={
            confirmAction ===
            "delete"
              ? "Delete"
              : confirmAction ===
                "start"
              ? "Start"
              : "Stop"
          }
          danger={
            confirmAction ===
            "delete"
          }
          loading={
            actionLoading
          }
          onConfirm={
            executeAction
          }
          onCancel={() => {
            if (!actionLoading) {
              setConfirmAction(
                null
              );
            }
          }}
        />
      </div>
    );
  };

export default InstanceDetails;