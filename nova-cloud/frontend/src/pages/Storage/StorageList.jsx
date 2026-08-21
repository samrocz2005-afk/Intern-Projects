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
  HddOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import StorageCard from "../../components/resources/StorageCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchStorage,
  deleteStorage,
} from "../../redux/slices/storageSlice";

import {
  selectStorage,
  selectStorageLoading,
  selectStorageError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const StorageList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();

  const storage = useSelector(selectStorage);
  const loading = useSelector(selectStorageLoading);
  const error = useSelector(selectStorageError);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { title: "Dashboard", path: "/dashboard" },
      { title: "Storage", path: "/storage" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(fetchStorage());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchStorage());
  };

  const handleDeleteClick = (item) => {
    setSelectedStorage(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    const id =
      selectedStorage?._id ||
      selectedStorage?.id;

    if (!id) return;

    try {
      setDeleteLoading(true);

      await dispatch(
        deleteStorage(id)
      ).unwrap();

      message.success(
        "Storage deleted successfully"
      );

      setDeleteOpen(false);
      setSelectedStorage(null);
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to delete storage"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && storage.length === 0) {
    return (
      <Loading
        fullScreen
        tip="Loading storage..."
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
            Storage
          </Title>

          <Text type="secondary">
            Create and manage your storage volumes.
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
              navigate("/storage/create")
            }
          >
            Create Storage
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

      {storage.length === 0 ? (
        <Card>
          <Empty
            image={
              <HddOutlined
                style={{ fontSize: 48 }}
              />
            }
            description="You don't have any storage volumes yet."
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate("/storage/create")
              }
            >
              Create Storage
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {storage.map((item) => {
            const id =
              item._id || item.id;

            return (
              <Col
                key={id}
                xs={24}
                sm={12}
                lg={8}
                xl={6}
              >
                <StorageCard
                  storage={item}
                  onClick={() =>
                    navigate(`/storage/${id}`)
                  }
                  onDelete={handleDeleteClick}
                />
              </Col>
            );
          })}
        </Row>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="Delete Storage"
        content={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {selectedStorage?.name ||
                "this storage"}
            </strong>
            ?
            <br />
            <br />
            Make sure the volume is not attached
            to an instance.
          </>
        }
        okText="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteOpen(false);
            setSelectedStorage(null);
          }
        }}
      />
    </div>
  );
};

export default StorageList;