import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Switch,
  Typography,
  message,
} from "antd";

import {
  LockOutlined,
  SaveOutlined,
  UserOutlined,
  BellOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import {
  getMe,
  changePassword,
} from "../../redux/slices/authSlice";

import {
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const Settings = () => {
  const dispatch = useDispatch();

  const { setBreadcrumbs } = useBreadcrumb();

  const user = useSelector(selectCurrentUser);

  const loading = useSelector(
    selectAuthLoading
  );

  const error = useSelector(
    selectAuthError
  );

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [notifications, setNotifications] =
    useState(true);

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
        title: "Settings",
        path: "/settings",
      },
    ]);
  }, [setBreadcrumbs]);

  /*
  |--------------------------------------------------------------------------
  | Load Current User
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Populate Profile Form
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!user) return;

    profileForm.setFieldsValue({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    if (
      user.preferences?.notifications !==
      undefined
    ) {
      setNotifications(
        user.preferences.notifications
      );
    }
  }, [user, profileForm]);

  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const handleRefresh = () => {
    dispatch(getMe());
  };

  /*
  |--------------------------------------------------------------------------
  | Profile
  |--------------------------------------------------------------------------
  |
  | Profile update API is not currently available
  | in authSlice/authApi.
  |
  | Keep the UI functional without calling a
  | non-existent Redux action.
  |
  */

  const handleProfileUpdate = async (values) => {
    try {
      setProfileSaving(true);

      /*
       * Currently there is no updateUserProfile
       * API/thunk in your project.
       *
       * So we only update the local Redux user
       * display and show an informational message.
       *
       * Add the backend profile update endpoint
       * later if you want this button to persist
       * changes to MongoDB.
       */

      console.log("Profile values:", {
        name: values.name.trim(),
        phone: values.phone?.trim() || "",
        notifications,
      });

      message.info(
        "Profile update API is not configured yet."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Change Password
  |--------------------------------------------------------------------------
  */

  const handlePasswordChange = async (
    values
  ) => {
    try {
      setPasswordSaving(true);

      await dispatch(
        changePassword({
          currentPassword:
            values.currentPassword,

          newPassword:
            values.newPassword,
        })
      ).unwrap();

      message.success(
        "Password changed successfully"
      );

      passwordForm.resetFields();
    } catch (err) {
      message.error(
        err?.message ||
          "Failed to change password"
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading && !user) {
    return (
      <Loading
        fullScreen
        tip="Loading settings..."
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error && !user) {
    return (
      <ErrorMessage
        message={error}
        onRetry={handleRefresh}
      />
    );
  }

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
        {/* ============================================================ */}
        {/* Header                                                        */}
        {/* ============================================================ */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              Settings
            </Title>

            <Text type="secondary">
              Manage your account and
              application preferences.
            </Text>
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        {/* ============================================================ */}
        {/* Profile                                                       */}
        {/* ============================================================ */}

        <Card
          title={
            <Space>
              <UserOutlined />
              Profile
            </Space>
          }
        >
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter your name",
                    },
                    {
                      min: 2,
                      message:
                        "Name must be at least 2 characters",
                    },
                    {
                      max: 100,
                      message:
                        "Name cannot exceed 100 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined />
                    }
                    placeholder="Your name"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                >
                  <Input
                    disabled
                    placeholder="Email"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      max: 20,
                      message:
                        "Phone number is too long",
                    },
                  ]}
                >
                  <Input
                    placeholder="Phone number"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Role">
                  <Input
                    disabled
                    value={
                      user?.role || "user"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              style={{
                marginBottom: 0,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={profileSaving}
              >
                Save Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* ============================================================ */}
        {/* Notifications                                                 */}
        {/* ============================================================ */}

        <Card
          title={
            <Space>
              <BellOutlined />
              Notifications
            </Space>
          }
        >
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text strong>
                Account Notifications
              </Text>

              <br />

              <Text type="secondary">
                Receive important notifications
                about your cloud resources and
                billing.
              </Text>
            </div>

            <Switch
              checked={notifications}
              onChange={setNotifications}
            />
          </Space>
        </Card>

        {/* ============================================================ */}
        {/* Password                                                      */}
        {/* ============================================================ */}

        <Card
          title={
            <Space>
              <LockOutlined />
              Change Password
            </Space>
          }
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Current Password"
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter your current password",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined />
                    }
                    placeholder="Current password"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a new password",
                    },
                    {
                      min: 8,
                      message:
                        "Password must be at least 8 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined />
                    }
                    placeholder="New password"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Confirm New Password"
                  name="confirmPassword"
                  dependencies={[
                    "newPassword",
                  ]}
                  rules={[
                    {
                      required: true,
                      message:
                        "Please confirm your new password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          getFieldValue(
                            "newPassword"
                          ) === value
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "Passwords do not match"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined />
                    }
                    placeholder="Confirm new password"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Button
              type="primary"
              htmlType="submit"
              icon={<LockOutlined />}
              loading={passwordSaving}
            >
              Change Password
            </Button>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default Settings;