import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
} from "antd";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ProfileCard from "../components/profile/ProfileCard";

import useAuth from "../hooks/useAuth";
import useProfileStore from "../store/profileStore";

function Profile() {
  const [form] = Form.useForm();

  const { user } = useAuth();

  const {
    profile,
    loading,
    error,
    fetchProfile,
    saveProfile,
    clearError,
  } = useProfileStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleOpenEditModal = () => {
    form.setFieldsValue(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    clearError();
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      setIsSaving(true);

      await saveProfile(user.id, {
        ...profile,
        ...values,
      });

      message.success("Profile updated successfully.");

      handleCloseModal();
    } catch (error) {
      message.error(
        error?.message || "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ErrorMessage message={error} />

      <ProfileCard
        profile={profile}
        onEdit={handleOpenEditModal}
      />

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleCloseModal}
        confirmLoading={isSaving}
        okText="Save Changes"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter your name.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[
              {
                required: true,
                message: "Please enter your department.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Roll Number"
            name="rollNumber"
            rules={[
              {
                required: true,
                message: "Please enter your roll number.",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Profile;