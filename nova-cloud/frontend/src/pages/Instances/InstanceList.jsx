import React, {
  useEffect,
  useState,
} from "react";

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
  CloudServerOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import InstanceCard from "../../components/resources/InstanceCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchInstances,
  deleteInstance,
} from "../../redux/slices/instanceSlice";

import {
  selectInstances,
  selectInstancesLoading,
  selectInstancesError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } =
  Typography;

const InstanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    setBreadcrumbs,
  } = useBreadcrumb();

  const instances =
    useSelector(
      selectInstances
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
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    selectedInstance,
    setSelectedInstance,
  ] = useState(null);

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
        title: "Instances",
        path: "/instances",
      },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(
      fetchInstances()
    );
  }, [dispatch]);

  const handleRefresh =
    () => {
      dispatch(
        fetchInstances()
      );
    };

  const handleDeleteClick =
    (instance) => {
      setSelectedInstance(
        instance
      );

      setDeleteOpen(true);
    };

  const handleDelete =
    async () => {
      if (
        !selectedInstance?._id &&
        !selectedInstance?.id
      ) {
        return;
      }

      const instanceId =
        selectedInstance._id ||
        selectedInstance.id;

      try {
        setDeleteLoading(true);

        await dispatch(
          deleteInstance(
            instanceId
          )
        ).unwrap();

        message.success(
          "Instance deleted successfully"
        );

        setDeleteOpen(false);
        setSelectedInstance(null);
      } catch (err) {
        message.error(
          err?.message ||
            "Failed to delete instance"
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  if (
    loading &&
    instances.length === 0
  ) {
    return (
      <Loading
        fullScreen
        tip="Loading instances..."
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 24,
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
            Instances
          </Title>

          <Text type="secondary">
            Create and manage your
            compute instances.
          </Text>
        </div>

        <Space>
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

          <Button
            type="primary"
            icon={
              <PlusOutlined />
            }
            onClick={() =>
              navigate(
                "/instances/create"
              )
            }
          >
            Create Instance
          </Button>
        </Space>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <ErrorMessage
            message={error}
            onRetry={
              handleRefresh
            }
          />
        </div>
      )}

      {instances.length === 0 ? (
        <Card>
          <Empty
            image={
              <CloudServerOutlined
                style={{
                  fontSize: 48,
                }}
              />
            }
            description="You don't have any instances yet."
          >
            <Button
              type="primary"
              icon={
                <PlusOutlined />
              }
              onClick={() =>
                navigate(
                  "/instances/create"
                )
              }
            >
              Create Instance
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row
          gutter={[
            16,
            16,
          ]}
        >
          {instances.map(
            (instance) => {
              const id =
                instance._id ||
                instance.id;

              return (
                <Col
                  key={id}
                  xs={24}
                  sm={12}
                  lg={8}
                  xl={6}
                >
                  <InstanceCard
                    instance={
                      instance
                    }
                    onClick={() =>
                      navigate(
                        `/instances/${id}`
                      )
                    }
                    onDelete={
                      handleDeleteClick
                    }
                  />
                </Col>
              );
            }
          )}
        </Row>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Delete Instance"
        content={
          <>
            Are you sure you want
            to delete{" "}
            <strong>
              {selectedInstance?.name ||
                "this instance"}
            </strong>
            ?
            <br />
            <br />
            This action cannot be
            undone.
          </>
        }
        okText="Delete"
        danger
        loading={deleteLoading}
        onConfirm={
          handleDelete
        }
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteOpen(false);
            setSelectedInstance(
              null
            );
          }
        }}
      />
    </div>
  );
};

export default InstanceList;