import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloudOutlined,
  DisconnectOutlined,
  EditOutlined,
  LinkOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import useDebounce from "../../hooks/useDebounce";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function Integrations() {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [integrations] = useState([
    {
      key: "1",
      name: "Razorpay",
      category: "Payment",
      description:
        "Accept online payments and manage payment transactions.",
      status: "Connected",
    },
    {
      key: "2",
      name: "Shiprocket",
      category: "Shipping",
      description:
        "Manage shipping, delivery tracking, and carrier services.",
      status: "Connected",
    },
    {
      key: "3",
      name: "Google Analytics",
      category: "Analytics",
      description:
        "Track website traffic and customer behavior.",
      status: "Connected",
    },
    {
      key: "4",
      name: "Mailchimp",
      category: "Marketing",
      description:
        "Manage email campaigns and customer newsletters.",
      status: "Disconnected",
    },
    {
      key: "5",
      name: "Salesforce",
      category: "CRM",
      description:
        "Synchronize customers and sales data with CRM.",
      status: "Disconnected",
    },
  ]);

  const filteredIntegrations = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return integrations;
    }

    return integrations.filter(
      (integration) =>
        integration.name
          .toLowerCase()
          .includes(value) ||
        integration.category
          .toLowerCase()
          .includes(value) ||
        integration.description
          .toLowerCase()
          .includes(value)
    );
  }, [integrations, debouncedSearch]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "Payment":
        return "green";

      case "Shipping":
        return "blue";

      case "Analytics":
        return "purple";

      case "Marketing":
        return "orange";

      case "CRM":
        return "cyan";

      default:
        return "default";
    }
  };

  const getIcon = (category) => {
    switch (category) {
      case "Payment":
        return <ApiOutlined />;

      case "Shipping":
        return <CloudOutlined />;

      case "Analytics":
        return <LinkOutlined />;

      case "Marketing":
        return <ApiOutlined />;

      case "CRM":
        return <SettingOutlined />;

      default:
        return <ApiOutlined />;
    }
  };

  return (
    <>
      <Breadcrumbs/>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Integrations
            </Title>

            <Text type="secondary">
              Connect payment, shipping, CRM, analytics,
              and marketing services.
            </Text>
          </div>

          <Input
            allowClear
            placeholder="Search integrations"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{ width: 260 }}
          />
        </div>

        <Row gutter={[16, 16]}>
          {filteredIntegrations.map((integration) => (
            <Col
              xs={24}
              sm={12}
              lg={8}
              key={integration.key}
            >
              <Card
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                  >
                    Configure
                  </Button>,
                ]}
              >
                <Space
                  align="start"
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      background: "#f0f5ff",
                      color: "#1677ff",
                      fontSize: 24,
                    }}
                  >
                    {getIcon(integration.category)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <Text strong>
                        {integration.name}
                      </Text>

                      <Tag
                        color={
                          integration.status ===
                          "Connected"
                            ? "green"
                            : "default"
                        }
                        icon={
                          integration.status ===
                          "Connected" ? (
                            <CheckCircleOutlined />
                          ) : (
                            <DisconnectOutlined />
                          )
                        }
                      >
                        {integration.status}
                      </Tag>
                    </div>

                    <Tag
                      color={getCategoryColor(
                        integration.category
                      )}
                      style={{ marginTop: 8 }}
                    >
                      {integration.category}
                    </Tag>

                    <Text
                      type="secondary"
                      style={{
                        display: "block",
                        marginTop: 10,
                      }}
                    >
                      {integration.description}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Integrations;