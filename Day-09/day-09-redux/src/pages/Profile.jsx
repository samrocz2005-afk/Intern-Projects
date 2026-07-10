import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, message } from "antd";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ProfileCard from "../components/profile/ProfileCard";

import { fetchProfile, updateProfile } from "../features/profile/profileSlice";

import {
  selectProfile,
  selectProfileLoading,
  selectProfileError,
} from "../features/profile/profileSelectors";

import { selectCurrentUser } from "../features/auth/authSelectors";

function Profile() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const user = useSelector(selectCurrentUser);
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user]);

  // Pre-fill the form whenever the modal opens with fresh profile data
  const handleOpenEditModal = () => {
    setIsModalOpen(true);
    if (profile) {
      form.setFieldsValue(profile);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);
      
      // Dispatch update action with old profile fields combined with new values
      await dispatch(updateProfile({ ...profile, ...values })).unwrap();
      
      message.success("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      message.error(err?.message || "Failed to update profile.");
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
        onEdit={handleOpenEditModal} // Triggers the modal open function
      />

      {/* Inlined Edit Modal Form */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
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
            rules={[{ required: true, message: "Please enter your name" }]}
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
            rules={[{ required: true, message: "Please enter your department" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Roll Number"
            name="rollNumber"
            rules={[{ required: true, message: "Please enter your roll number" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Profile;