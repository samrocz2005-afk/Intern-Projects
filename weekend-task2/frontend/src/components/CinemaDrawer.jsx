import { Drawer, Image, Typography, Tag, Descriptions, Space } from "antd";

const { Text, Title } = Typography;

function CinemaDrawer({ open, cinema, onClose }) {
  return (
    <Drawer
      title="Cinema Details"
      width={480}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      {cinema && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Top Header Card with Image & Core Info */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              padding: "16px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
              alignItems: "center",
            }}
          >
            <Image
              width={90}
              height={90}
              style={{ objectFit: "cover", borderRadius: "6px" }}
              src={cinema?.image || "https://via.placeholder.com/90?text=Cinema"}
              fallback="https://via.placeholder.com/90?text=Cinema"
              alt={cinema?.name || "Cinema"}
            />
            <div style={{ flex: 1 }}>
              <Title level={5} style={{ margin: 0 }}>
                {cinema?.name || "N/A"}
              </Title>
              <Space direction="vertical" size={2} style={{ marginTop: "4px" }}>
                <Text type="secondary">
                  📍 {cinema?.location || "N/A"}
                </Text>
                <Text type="secondary">
                  🏙️ {cinema?.city || "N/A"}
                  {cinema?.state ? `, ${cinema?.state}` : ""}
                </Text>
              </Space>
            </div>
          </div>

          {/* Full Cinema Details List */}
          <Descriptions title="Full Specifications" column={1} bordered size="small">
            <Descriptions.Item label="Cinema Name">{cinema?.name}</Descriptions.Item>
            <Descriptions.Item label="City">{cinema?.city}</Descriptions.Item>
            <Descriptions.Item label="State">{cinema?.state}</Descriptions.Item>
            <Descriptions.Item label="Location">{cinema?.location}</Descriptions.Item>
            <Descriptions.Item label="Screens">{cinema?.screens || "-"}</Descriptions.Item>
            <Descriptions.Item label="Capacity">{cinema?.capacity || "-"}</Descriptions.Item>
            <Descriptions.Item label="Contact">{cinema?.contactNumber || "-"}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={cinema?.status === "Active" ? "green" : "red"}>
                {cinema?.status || "Active"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Space>
      )}
    </Drawer>
  );
}

export default CinemaDrawer;