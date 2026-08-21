import React, {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  createInstance,
} from "../../redux/slices/instanceSlice";

import {
  fetchNetworks,
} from "../../redux/slices/networkSlice";

import {
  selectNetworks,
  selectNetworksLoading,
} from "../../redux/selectors/resourceSelectors";

import {
  getFlavors,
} from "../../services/flavorApi";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const {
  Title,
  Text,
} = Typography;

const CreateInstance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const {
    setBreadcrumbs,
  } = useBreadcrumb();

  /*
  |--------------------------------------------------------------------------
  | Networks
  |--------------------------------------------------------------------------
  */

  const networks = useSelector(
    selectNetworks
  );

  const networksLoading =
    useSelector(
      selectNetworksLoading
    );

  /*
  |--------------------------------------------------------------------------
  | Flavors
  |--------------------------------------------------------------------------
  */

  const [
    flavors,
    setFlavors,
  ] = useState([]);

  const [
    flavorsLoading,
    setFlavorsLoading,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Breadcrumbs
  |--------------------------------------------------------------------------
  */

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
        title: "Create Instance",
        path: "/instances/create",
      },
    ]);
  }, [setBreadcrumbs]);

  /*
  |--------------------------------------------------------------------------
  | Load Networks
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(fetchNetworks());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Load Active Flavors
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadFlavors = async () => {
      try {
        setFlavorsLoading(true);

        const response = await getFlavors({
          isActive: true,
          limit: 100,
          page: 1,
        });

        console.log(
          "Flavor API response:",
          response
        );

        if (!mounted) {
          return;
        }

        const flavorList =
          Array.isArray(
            response?.data?.items
          )
            ? response.data.items
            : [];

        /*
        |--------------------------------------------------------------------------
        | Keep only active flavors on frontend
        |--------------------------------------------------------------------------
        */

        const activeFlavors =
          flavorList.filter(
            (flavor) =>
              flavor?.isActive === true
          );

        console.log(
          "Loaded flavors:",
          activeFlavors
        );

        setFlavors(
          activeFlavors
        );

        if (
          activeFlavors.length === 0
        ) {
          message.warning(
            "No active flavors are available"
          );
        }
      } catch (error) {
        console.error(
          "Flavor loading error:",
          error
        );

        if (!mounted) {
          return;
        }

        setFlavors([]);

        message.error(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load flavors"
        );
      } finally {
        if (mounted) {
          setFlavorsLoading(false);
        }
      }
    };

    loadFlavors();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    values
  ) => {
    try {
      setSubmitting(true);

      const payload = {
        name: values.name,

        flavor: values.flavor,

        network:
          values.network || null,

        operatingSystem:
          values.operatingSystem,

        sshKeyName:
          values.sshKeyName || null,
      };

      console.log(
        "Creating instance with:",
        payload
      );

      const response =
        await dispatch(
          createInstance(payload)
        ).unwrap();

      console.log(
        "Create instance response:",
        response
      );

      message.success(
        "Instance created successfully"
      );

      /*
      |--------------------------------------------------------------------------
      | Handle response
      |--------------------------------------------------------------------------
      */

      const instance =
        response?.data ||
        response;

      const id =
        instance?._id ||
        instance?.id;

      if (id) {
        navigate(
          `/instances/${id}`
        );
      } else {
        navigate(
          "/instances"
        );
      }
    } catch (error) {
      console.error(
        "Create instance error:",
        error
      );

      message.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to create instance"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      <Space
        direction="vertical"
        size={24}
        style={{
          width: "100%",
        }}
      >
        {/* Header */}

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
            Back to Instances
          </Button>

          <Title
            level={2}
            style={{
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Create Instance
          </Title>

          <Text type="secondary">
            Configure your new
            compute instance.
          </Text>
        </div>

        {/* Form */}

        <Card>
          <Alert
            type="info"
            showIcon
            message="Billing"
            description="Instance charges are calculated by the backend according to the selected flavor and actual usage time."
            style={{
              marginBottom: 24,
            }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={
              handleSubmit
            }
            requiredMark="optional"
          >
            <Row
              gutter={[
                16,
                0,
              ]}
            >
              {/* Instance Name */}

              <Col
                xs={24}
                md={12}
              >
                <Form.Item
                  label="Instance Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter an instance name",
                    },
                    {
                      min: 2,
                      message:
                        "Name must be at least 2 characters",
                    },
                    {
                      max: 50,
                      message:
                        "Name cannot exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <CloudServerOutlined />
                    }
                    placeholder="my-instance"
                  />
                </Form.Item>
              </Col>

              {/* Flavor */}

              <Col
                xs={24}
                md={12}
              >
                <Form.Item
                  label="Flavor"
                  name="flavor"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select a flavor",
                    },
                  ]}
                >
                  <Select
                    loading={
                      flavorsLoading
                    }
                    disabled={
                      flavorsLoading ||
                      flavors.length === 0
                    }
                    placeholder={
                      flavorsLoading
                        ? "Loading flavors..."
                        : flavors.length === 0
                        ? "No flavors available"
                        : "Select a flavor"
                    }
                    options={flavors.map(
                      (flavor) => ({
                        value:
                          flavor._id,

                        label:
                          flavor.name,

                        title:
                          `${flavor.name} - ` +
                          `${flavor.vcpus} vCPU / ` +
                          `${flavor.ram} GB RAM / ` +
                          `${flavor.disk} GB Disk`,
                      })
                    )}
                    optionRender={(
                      option
                    ) => {
                      const flavor =
                        flavors.find(
                          (item) =>
                            String(
                              item._id
                            ) ===
                            String(
                              option.value
                            )
                        );

                      if (!flavor) {
                        return (
                          <span>
                            {
                              option.label
                            }
                          </span>
                        );
                      }

                      return (
                        <div>
                          <div>
                            <strong>
                              {
                                flavor.name
                              }
                            </strong>
                          </div>

                          <Text type="secondary">
                            {
                              flavor.vcpus
                            }{" "}
                            vCPU ·{" "}
                            {
                              flavor.ram
                            }{" "}
                            GB RAM ·{" "}
                            {
                              flavor.disk
                            }{" "}
                            GB Disk · ₹
                            {Number(
                              flavor.hourlyPrice ||
                                0
                            ).toFixed(
                              2
                            )}
                            /hr
                          </Text>
                        </div>
                      );
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Network */}

              <Col
                xs={24}
                md={12}
              >
                <Form.Item
                  label="Network"
                  name="network"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select a network",
                    },
                  ]}
                >
                  <Select
                    loading={
                      networksLoading
                    }
                    disabled={
                      networksLoading
                    }
                    placeholder={
                      networksLoading
                        ? "Loading networks..."
                        : "Select a network"
                    }
                    options={networks.map(
                      (network) => ({
                        value:
                          network._id ||
                          network.id,

                        label:
                          network.name,
                      })
                    )}
                  />
                </Form.Item>
              </Col>

              {/* Operating System */}

              <Col
                xs={24}
                md={12}
              >
                <Form.Item
                  label="Operating System"
                  name="operatingSystem"
                  initialValue="ubuntu-24.04"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter an operating system",
                    },
                    {
                      min: 2,
                      message:
                        "Operating system must be at least 2 characters",
                    },
                    {
                      max: 50,
                      message:
                        "Operating system cannot exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="ubuntu-24.04"
                  />
                </Form.Item>
              </Col>

              {/* SSH Key */}

              <Col xs={24}>
                <Form.Item
                  label="SSH Key Name"
                  name="sshKeyName"
                >
                  <Input
                    placeholder="my-ssh-key"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Buttons */}

            <Form.Item
              style={{
                marginBottom: 0,
              }}
            >
              <Space>
                <Button
                  onClick={() =>
                    navigate(
                      "/instances"
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    submitting
                  }
                  disabled={
                    flavorsLoading ||
                    flavors.length === 0
                  }
                >
                  Create Instance
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CreateInstance;