import React, { useEffect, useRef, useState } from "react";

import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Tag,
  Divider,
  message,
  Spin,
} from "antd";

import {
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  SafetyOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import {
  selectUser,
  uploadProfileImage,
  selectProfileImageUploading,
} from "../../redux/slices/authSlice";

import api from "../../services/api";

const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const uploading = useSelector(
    selectProfileImageUploading
  );

  const fileInputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Profile Image Blob URL
  |--------------------------------------------------------------------------
  */

  const [profileImageUrl, setProfileImageUrl] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Profile Image
  |--------------------------------------------------------------------------
  |
  | Approach 3:
  |
  | MongoDB
  |    ↓
  | User.profileImage.data
  |    ↓
  | GET /api/auth/profile-image
  |    ↓
  | Axios responseType: blob
  |    ↓
  | URL.createObjectURL()
  |    ↓
  | Avatar
  |
  |--------------------------------------------------------------------------
  */

  const loadProfileImage = async () => {
    try {
      /*
      |--------------------------------------------------------------------------
      | No image
      |--------------------------------------------------------------------------
      */

      if (!user?.profileImage) {
        setProfileImageUrl(null);
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Request image as Blob
      |--------------------------------------------------------------------------
      */

      const response = await api.get(
        "/auth/profile-image",
        {
          responseType: "blob",
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Create Browser Object URL
      |--------------------------------------------------------------------------
      */

      const blobUrl =
        URL.createObjectURL(
          response.data
        );

      /*
      |--------------------------------------------------------------------------
      | Cleanup Previous Blob URL
      |--------------------------------------------------------------------------
      */

      setProfileImageUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(
            previousUrl
          );
        }

        return blobUrl;
      });
    } catch (error) {
      console.error(
        "Failed to load profile image:",
        error
      );

      setProfileImageUrl(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Image When User Changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadProfileImage();

    return () => {
      setProfileImageUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(
            previousUrl
          );
        }

        return null;
      });
    };
  }, [
    user?._id,
    user?.profileImage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Select Image
  |--------------------------------------------------------------------------
  */

  const handleSelectImage = () => {
    if (uploading) {
      return;
    }

    fileInputRef.current?.click();
  };

  /*
  |--------------------------------------------------------------------------
  | Upload Image
  |--------------------------------------------------------------------------
  */

  const handleImageChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Type
    |--------------------------------------------------------------------------
    */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      message.error(
        "Only JPEG, PNG, WebP and GIF images are allowed"
      );

      event.target.value = "";

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Size
    |--------------------------------------------------------------------------
    */

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      message.error(
        "Profile image must not exceed 5MB"
      );

      event.target.value = "";

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Upload
    |--------------------------------------------------------------------------
    */

    try {
      await dispatch(
        uploadProfileImage(file)
      ).unwrap();

      /*
      |--------------------------------------------------------------------------
      | Reload Image From MongoDB
      |--------------------------------------------------------------------------
      */

      await loadProfileImage();

      message.success(
        "Profile image uploaded successfully"
      );
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      message.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Failed to upload profile image"
      );
    } finally {
      event.target.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | No User
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <Card>
        <Text>
          Unable to load profile.
        </Text>
      </Card>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Debug
  |--------------------------------------------------------------------------
  */

  console.log(
    "User:",
    user
  );

  console.log(
    "Profile image exists:",
    Boolean(
      user.profileImage
    )
  );

  console.log(
    "Profile image blob URL:",
    profileImageUrl
  );

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div
      style={{
        padding: 24,
      }}
    >
      <Title level={2}>
        My Profile
      </Title>

      <Text type="secondary">
        Manage your Nova Cloud account
        information.
      </Text>

      <Row
        gutter={[24, 24]}
        style={{
          marginTop: 24,
        }}
      >
        {/* Profile Image */}

        <Col
          xs={24}
          md={8}
          lg={7}
        >
          <Card>
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Avatar */}

              <div
                style={{
                  position:
                    "relative",
                  width: 140,
                  height: 140,
                }}
              >
                <Avatar
                  size={140}
                  src={
                    profileImageUrl ||
                    undefined
                  }
                  icon={
                    !profileImageUrl ? (
                      <UserOutlined />
                    ) : undefined
                  }
                />

                {uploading && (
                  <div
                    style={{
                      position:
                        "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      background:
                        "rgba(255,255,255,0.75)",
                      borderRadius:
                        "50%",
                    }}
                  >
                    <Spin />
                  </div>
                )}
              </div>

              {/* Name */}

              <Title
                level={3}
                style={{
                  marginTop: 16,
                  marginBottom: 4,
                }}
              >
                {user.name}
              </Title>

              {/* Email */}

              <Text type="secondary">
                {user.email}
              </Text>

              {/* Role */}

              <Tag
                color={
                  user.role ===
                  "admin"
                    ? "blue"
                    : "green"
                }
                style={{
                  marginTop: 12,
                }}
              >
                {user.role?.toUpperCase()}
              </Tag>

              {/* Hidden File Input */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={
                  handleImageChange
                }
                style={{
                  display: "none",
                }}
              />

              {/* Upload Button */}

              <Button
                icon={
                  <CameraOutlined />
                }
                onClick={
                  handleSelectImage
                }
                loading={uploading}
                disabled={uploading}
                style={{
                  marginTop: 20,
                }}
              >
                {uploading
                  ? "Uploading..."
                  : "Change Profile Image"}
              </Button>

              <Text
                type="secondary"
                style={{
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                JPEG, PNG, WebP or GIF ·
                Maximum 5MB
              </Text>
            </div>
          </Card>
        </Col>

        {/* Account Information */}

        <Col
          xs={24}
          md={16}
          lg={17}
        >
          <Card title="Account Information">
            <Space
              direction="vertical"
              size="large"
              style={{
                width: "100%",
              }}
            >
              {/* Name */}

              <div>
                <Space>
                  <UserOutlined />

                  <Text type="secondary">
                    Name
                  </Text>
                </Space>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <Text strong>
                    {user.name}
                  </Text>
                </div>
              </div>

              <Divider
                style={{
                  margin: 0,
                }}
              />

              {/* Email */}

              <div>
                <Space>
                  <MailOutlined />

                  <Text type="secondary">
                    Email
                  </Text>
                </Space>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <Text strong>
                    {user.email}
                  </Text>
                </div>
              </div>

              <Divider
                style={{
                  margin: 0,
                }}
              />

              {/* Role */}

              <div>
                <Space>
                  <SafetyOutlined />

                  <Text type="secondary">
                    Role
                  </Text>
                </Space>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <Tag
                    color={
                      user.role ===
                      "admin"
                        ? "blue"
                        : "green"
                    }
                  >
                    {user.role?.toUpperCase()}
                  </Tag>
                </div>
              </div>

              <Divider
                style={{
                  margin: 0,
                }}
              />

              {/* Account Status */}

              <div>
                <Space>
                  {user.isActive ? (
                    <CheckCircleOutlined
                      style={{
                        color:
                          "#52c41a",
                      }}
                    />
                  ) : (
                    <CloseCircleOutlined
                      style={{
                        color:
                          "#ff4d4f",
                      }}
                    />
                  )}

                  <Text type="secondary">
                    Account Status
                  </Text>
                </Space>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <Tag
                    color={
                      user.isActive
                        ? "success"
                        : "error"
                    }
                  >
                    {user.isActive
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </Tag>
                </div>
              </div>

              <Divider
                style={{
                  margin: 0,
                }}
              />

              {/* Balance */}

              <div>
                <Space>
                  <WalletOutlined />

                  <Text type="secondary">
                    Balance
                  </Text>
                </Space>

                <div
                  style={{
                    marginTop: 4,
                  }}
                >
                  <Text strong>
                    ₹
                    {Number(
                      user.balance ||
                        0
                    ).toFixed(2)}
                  </Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;