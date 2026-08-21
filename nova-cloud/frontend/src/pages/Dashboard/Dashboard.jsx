import React, { useEffect, useMemo } from "react";

import {
  Button,
  Col,
  Row,
  Typography,
  message,
} from "antd";

import {
  CloudServerOutlined,
  GlobalOutlined,
  HddOutlined,
  NodeIndexOutlined,
  SwapOutlined,
  DollarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ResourceCard from "../../components/dashboard/ResourceCard";
import UsageCard from "../../components/dashboard/UsageCard";
import InstanceSummary from "../../components/dashboard/InstanceSummary";
// import UsageChart from "../../components/dashboard/UsageChart";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  fetchInstances,
} from "../../redux/slices/instanceSlice";

import {
  fetchNetworks,
} from "../../redux/slices/networkSlice";

import {
  fetchStorage,
} from "../../redux/slices/storageSlice";

import {
  fetchRouters,
} from "../../redux/slices/routerSlice";

import {
  fetchLoadBalancers,
} from "../../redux/slices/loadBalancerSlice";

import {
  fetchBilling,
} from "../../redux/slices/billingSlice";

import {
  selectCurrentUser,
  selectInstances,
  selectInstancesLoading,
  selectInstancesError,
  selectNetworks,
  selectNetworksLoading,
  selectNetworksError,
  selectStorage,
  selectStorageLoading,
  selectStorageError,
  selectRouters,
  selectRoutersLoading,
  selectRoutersError,
  selectLoadBalancers,
  selectLoadBalancersLoading,
  selectLoadBalancersError,
  selectBilling,
  selectBillingLoading,
  selectBillingSummary,
  selectBillingError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    setBreadcrumbs,
  } = useBreadcrumb();

  /*
  |--------------------------------------------------------------------------
  | Redux state
  |--------------------------------------------------------------------------
  */

  const user = useSelector(
    selectCurrentUser
  );

  const instances = useSelector(
    selectInstances
  );

  const networks = useSelector(
    selectNetworks
  );

  const storage = useSelector(
    selectStorage
  );

  const routers = useSelector(
    selectRouters
  );

  const loadBalancers = useSelector(
    selectLoadBalancers
  );

  const billing = useSelector(
    selectBilling
  );

  const billingSummary = useSelector(
    selectBillingSummary
  );

  /*
  |--------------------------------------------------------------------------
  | Loading states
  |--------------------------------------------------------------------------
  */

  const instancesLoading =
    useSelector(
      selectInstancesLoading
    );

  const networksLoading =
    useSelector(
      selectNetworksLoading
    );

  const storageLoading =
    useSelector(
      selectStorageLoading
    );

  const routersLoading =
    useSelector(
      selectRoutersLoading
    );

  const loadBalancersLoading =
    useSelector(
      selectLoadBalancersLoading
    );

  const billingLoading =
    useSelector(
      selectBillingLoading
    );

  /*
  |--------------------------------------------------------------------------
  | Errors
  |--------------------------------------------------------------------------
  */

  const instancesError =
    useSelector(
      selectInstancesError
    );

  const networksError =
    useSelector(
      selectNetworksError
    );

  const storageError =
    useSelector(
      selectStorageError
    );

  const routersError =
    useSelector(
      selectRoutersError
    );

  const loadBalancersError =
    useSelector(
      selectLoadBalancersError
    );

  const billingError =
    useSelector(
      selectBillingError
    );

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
    ]);
  }, [setBreadcrumbs]);

  /*
  |--------------------------------------------------------------------------
  | Load dashboard resources
  |--------------------------------------------------------------------------
  */

  const loadDashboard =
    () => {
      dispatch(
        fetchInstances()
      );

      dispatch(
        fetchNetworks()
      );

      dispatch(
        fetchStorage()
      );

      dispatch(
        fetchRouters()
      );

      dispatch(
        fetchLoadBalancers()
      );

      dispatch(
        fetchBilling()
      );
    };

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Resource counts
  |--------------------------------------------------------------------------
  */

  const resourceCounts =
    useMemo(
      () => ({
        instances:
          instances.length,
        networks:
          networks.length,
        storage:
          storage.length,
        routers:
          routers.length,
        loadBalancers:
          loadBalancers.length,
      }),
      [
        instances,
        networks,
        storage,
        routers,
        loadBalancers,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | Storage usage
  |--------------------------------------------------------------------------
  */

  const storageUsage =
    useMemo(() => {
      const total =
        storage.reduce(
          (sum, item) =>
            sum +
            Number(
              item.size ??
                item.capacity ??
                0
            ),
          0
        );

      const used =
        storage.reduce(
          (sum, item) =>
            sum +
            Number(
              item.used ?? 0
            ),
          0
        );

      return {
        total,
        used,
      };
    }, [storage]);

  /*
  |--------------------------------------------------------------------------
  | Usage chart
  |--------------------------------------------------------------------------
  */

  const usageData =
    useMemo(() => {
      /*
       * If the billing/usage API later
       * returns real hourly metrics,
       * replace this with those values.
       *
       * Do not calculate billing charges
       * in the frontend.
       */

      return [];
    }, [billing]);

  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const handleRefresh =
    async () => {
      try {
        await Promise.all([
          dispatch(
            fetchInstances()
          ).unwrap(),

          dispatch(
            fetchNetworks()
          ).unwrap(),

          dispatch(
            fetchStorage()
          ).unwrap(),

          dispatch(
            fetchRouters()
          ).unwrap(),

          dispatch(
            fetchLoadBalancers()
          ).unwrap(),

          dispatch(
            fetchBilling()
          ).unwrap(),
        ]);

        message.success(
          "Dashboard refreshed"
        );
      } catch (error) {
        message.error(
          "Some dashboard data could not be refreshed"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Page-level loading
  |--------------------------------------------------------------------------
  */

  const initialLoading =
    instancesLoading &&
    networksLoading &&
    storageLoading &&
    routersLoading &&
    loadBalancersLoading &&
    billingLoading &&
    instances.length === 0;

  if (initialLoading) {
    return (
      <Loading
        fullScreen
        tip="Loading dashboard..."
      />
    );
  }

  return (
    <div>
      {/* --------------------------------------------------------------- */}
      {/* Header */}
      {/* --------------------------------------------------------------- */}

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
            Dashboard
          </Title>

          <Text type="secondary">
            Welcome back
            {user?.name
              ? `, ${user.name}`
              : ""}
            . Manage your cloud
            resources from here.
          </Text>
        </div>

        <Button
          icon={
            <ReloadOutlined />
          }
          onClick={handleRefresh}
          loading={
            instancesLoading ||
            networksLoading ||
            storageLoading ||
            routersLoading ||
            loadBalancersLoading ||
            billingLoading
          }
        >
          Refresh
        </Button>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* Resource cards */}
      {/* --------------------------------------------------------------- */}

      <Row
        gutter={[
          16,
          16,
        ]}
      >
        <Col
          xs={24}
          sm={12}
          lg={8}
          xl={6}
        >
          <ResourceCard
            title="Instances"
            value={
              resourceCounts.instances
            }
            icon={
              <CloudServerOutlined />
            }
            loading={
              instancesLoading
            }
            description="Compute instances"
            onClick={() =>
              navigate(
                "/instances"
              )
            }
          />
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={8}
          xl={6}
        >
          <ResourceCard
            title="Networks"
            value={
              resourceCounts.networks
            }
            icon={
              <GlobalOutlined />
            }
            loading={
              networksLoading
            }
            description="Virtual networks"
            onClick={() =>
              navigate(
                "/networks"
              )
            }
          />
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={8}
          xl={6}
        >
          <ResourceCard
            title="Storage"
            value={
              resourceCounts.storage
            }
            icon={
              <HddOutlined />
            }
            loading={
              storageLoading
            }
            description="Storage volumes"
            onClick={() =>
              navigate(
                "/storage"
              )
            }
          />
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={8}
          xl={6}
        >
          <ResourceCard
            title="Routers"
            value={
              resourceCounts.routers
            }
            icon={
              <NodeIndexOutlined />
            }
            loading={
              routersLoading
            }
            description="Network routers"
            onClick={() =>
              navigate(
                "/routers"
              )
            }
          />
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={8}
          xl={6}
        >
          <ResourceCard
            title="Load Balancers"
            value={
              resourceCounts.loadBalancers
            }
            icon={
              <SwapOutlined />
            }
            loading={
              loadBalancersLoading
            }
            description="Traffic distribution"
            onClick={() =>
              navigate(
                "/load-balancers"
              )
            }
          />
        </Col>

        <Col
          xs={24}
          sm={12}
          lg={8}
          xl={6}
        >
          <ResourceCard
            title="Current Billing"
            value={
              Number(
                billingSummary?.currentMonth ??
                  billingSummary?.total ??
                  0
              )
            }
            prefix="₹"
            icon={
              <DollarOutlined />
            }
            loading={
              billingLoading
            }
            description="Current billing"
            onClick={() =>
              navigate(
                "/billing"
              )
            }
          />
        </Col>
      </Row>

      {/* --------------------------------------------------------------- */}
      {/* Errors */}
      {/* --------------------------------------------------------------- */}

      {(instancesError ||
        networksError ||
        storageError ||
        routersError ||
        loadBalancersError ||
        billingError) && (
        <div
          style={{
            marginTop: 16,
          }}
        >
          <ErrorMessage
            message="Some dashboard resources could not be loaded."
            onRetry={
              handleRefresh
            }
          />
        </div>
      )}

      {/* --------------------------------------------------------------- */}
      {/* Instance summary */}
      {/* --------------------------------------------------------------- */}

      <div
        style={{
          marginTop: 16,
        }}
      >
        <InstanceSummary
          instances={instances}
          loading={
            instancesLoading
          }
        />
      </div>

      {/* --------------------------------------------------------------- */}
      {/* Usage */}
      {/* --------------------------------------------------------------- */}

      <Row
        gutter={[
          16,
          16,
        ]}
        style={{
          marginTop: 0,
        }}
      >
        <Col
          xs={24}
          lg={12}
        >
          <UsageCard
            title="Storage Usage"
            used={
              storageUsage.used
            }
            total={
              storageUsage.total
            }
            unit="GB"
            loading={
              storageLoading
            }
            description="Allocated storage across your volumes"
          />
        </Col>

        <Col
          xs={24}
          lg={12}
        >
          <UsageCard
            title="Instance Usage"
            used={
              resourceCounts.instances
            }
            total={
              resourceCounts.instances
            }
            unit="instances"
            loading={
              instancesLoading
            }
            description="Current compute resources"
          />
        </Col>
      </Row>

      {/* --------------------------------------------------------------- */}
      {/* Usage chart */}
      {/* --------------------------------------------------------------- */}

      <div
        style={{
          marginTop: 16,
        }}
      >
      </div>
    </div>
  );
};

export default Dashboard;