import React from "react";
import { Card, Descriptions, Avatar, Button, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

function ProfileCard({ profile, onEdit }) {
  if (!profile) {
    return null;
  }

  return (
    <Card
      title="Student Profile"
      style={{ maxWidth: 700, margin: "0 auto" }}
    >
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%" }} // Removed alignItems: "center" so content stretches fully
      >
        {/* Centered the Avatar manually using a wrapper div */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Avatar
            size={90}
            icon={<UserOutlined />}
          />
        </div>

        {/* explicitly setting content widths prevents the label/content from shrinking unevenly */}
        <Descriptions
          bordered
          column={1}
          style={{ width: "100%" }}
          labelStyle={{ width: "30%" }}   
          contentStyle={{ width: "70%" }} 
        >
          <Descriptions.Item label="Name">
            {profile.name}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {profile.email}
          </Descriptions.Item>

          <Descriptions.Item label="Department">
            {profile.department}
          </Descriptions.Item>

          <Descriptions.Item label="Roll Number">
            {profile.rollNumber}
          </Descriptions.Item>
        </Descriptions>

        {/* Centered the Button manually using a wrapper div */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            type="primary"
            onClick={onEdit}
          >
            Edit Profile
          </Button>
        </div>
      </Space>
    </Card>
  );
}

export default ProfileCard;