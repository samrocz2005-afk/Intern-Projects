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
  GlobalOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import NetworkCard from "../../components/resources/NetworkCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchNetworks,
  deleteNetwork,
} from "../../redux/slices/networkSlice";

import {
  selectNetworks,
  selectNetworksLoading,
  selectNetworksError,
} from "../../redux/selectors/resourceSelectors";

import { selectUser } from "../../redux/slices/authSlice";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const NetworkList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setBreadcrumbs } = useBreadcrumb();

  /*
  |--------------------------------------------------------------------------
  | Resource selectors
  |--------------------------------------------------------------------------
  */

  const networks = useSelector(selectNetworks);
  const loading = useSelector(selectNetworksLoading);
  const error = useSelector(selectNetworksError);

  /*
  |--------------------------------------------------------------------------
  | Auth selector
  |--------------------------------------------------------------------------
  */

  const user = useSelector(selectUser);

  const isAdmin = user?.role === "admin";

  /*
  |--------------------------------------------------------------------------
  | Delete state
  |--------------------------------------------------------------------------
  */

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] =
    useState(null);
  const [deleteLoading, setDeleteLoading] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Breadcrumb
  |--------------------------------------------------------------------------
  */

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
    ]);
  }, [setBreadcrumbs]);

  /*
  |--------------------------------------------------------------------------
  | Fetch networks
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(fetchNetworks());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const handleRefresh = () => {
    dispatch(fetchNetworks());
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDeleteClick = (network) => {
    if (!isAdmin) {
      return;
    }

    setSelectedNetwork(network);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      return;
    }

    const networkId =
      selectedNetwork?._id ||
      selectedNetwork?.id;

    if (!networkId) {
      return;
    }

    try {
      setDeleteLoading(true);

      await dispatch(
        deleteNetwork(networkId)
      ).unwrap();

      message.success(
        "Network deleted successfully"
      );

      setDeleteOpen(false);
      setSelectedNetwork(null);

      /*
       * Refresh after deletion
       */
      dispatch(fetchNetworks());
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to delete network"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial loading
  |--------------------------------------------------------------------------
  */

  if (loading && networks.length === 0) {
    return (
      <Loading
        fullScreen
        tip="Loading networks..."
      />
    );
  }

  return (
    <div>
      {/*
      |--------------------------------------------------------------------------
      | Header
      |--------------------------------------------------------------------------
      */}

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
          <Title
            level={2}
            style={{ margin: 0 }}
          >
            Networks
          </Title>

          <Text type="secondary">
            {isAdmin
              ? "Create and manage virtual networks."
              : "View available virtual networks."}
          </Text>
        </div>

        <Space>
          {/*
          |--------------------------------------------------------------------------
          | Refresh - Admin + User
          |--------------------------------------------------------------------------
          */}

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>

          {/*
          |--------------------------------------------------------------------------
          | Create - ADMIN ONLY
          |--------------------------------------------------------------------------
          */}

          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate("/networks/create")
              }
            >
              Create Network
            </Button>
          )}
        </Space>
      </div>

      {/*
      |--------------------------------------------------------------------------
      | Error
      |--------------------------------------------------------------------------
      */}

      {error && (
        <div style={{ marginBottom: 16 }}>
          <ErrorMessage
            message={error}
            onRetry={handleRefresh}
          />
        </div>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Empty state
      |--------------------------------------------------------------------------
      */}

      {networks.length === 0 ? (
        <Card>
          <Empty
            image={
              <GlobalOutlined
                style={{ fontSize: 48 }}
              />
            }
            description={
              isAdmin
                ? "You don't have any networks yet."
                : "No networks are currently available."
            }
          >
            {/*
            |--------------------------------------------------------------------------
            | Create button only for ADMIN
            |--------------------------------------------------------------------------
            */}

            {isAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  navigate(
                    "/networks/create"
                  )
                }
              >
                Create Network
              </Button>
            )}
          </Empty>
        </Card>
      ) : (
        /*
        |--------------------------------------------------------------------------
        | Network cards
        |--------------------------------------------------------------------------
        */

        <Row gutter={[16, 16]}>
          {networks.map((network) => {
            const id =
              network._id ||
              network.id;

            return (
              <Col
                key={id}
                xs={24}
                sm={12}
                lg={8}
                xl={6}
              >
                <NetworkCard
                  network={network}
                  onClick={() =>
                    navigate(
                      `/networks/${id}`
                    )
                  }
                  /*
                   * Delete callback is only supplied
                   * to admin.
                   */
                  onDelete={
                    isAdmin
                      ? handleDeleteClick
                      : undefined
                  }
                />
              </Col>
            );
          })}
        </Row>
      )}

      {/*
      |--------------------------------------------------------------------------
      | Delete confirmation - ADMIN ONLY
      |--------------------------------------------------------------------------
      */}

      {isAdmin && (
        <ConfirmModal
          open={deleteOpen}
          title="Delete Network"
          content={
            <>
              Are you sure you want to
              delete{" "}
              <strong>
                {selectedNetwork?.name ||
                  "this network"}
              </strong>
              ?
              <br />
              <br />
              Make sure no resources are
              still using this network.
            </>
          }
          okText="Delete"
          danger
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => {
            if (!deleteLoading) {
              setDeleteOpen(false);
              setSelectedNetwork(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default NetworkList;