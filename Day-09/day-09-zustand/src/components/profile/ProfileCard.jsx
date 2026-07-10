import React from "react";
import { Card, Descriptions, Avatar, Button } from "antd";
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
      {/* Replaced <Space> with a native flex container to eliminate the deprecation warning */}
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "24px", 
          width: "100%" 
        }}
      >
        {/* Centered the Avatar */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Avatar
            size={90}
            icon={<UserOutlined />}
          />
        </div>

        {/* Profile layout parameters explicitly matching widths */}
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

        {/* Centered the Action Button */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            type="primary"
            onClick={onEdit}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProfileCard;