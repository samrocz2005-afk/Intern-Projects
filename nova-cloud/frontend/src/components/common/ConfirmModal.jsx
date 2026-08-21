import React from "react";

import {
  Modal,
} from "antd";

import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const ConfirmModal = ({
  open = false,
  title = "Are you sure?",
  content = "This action cannot be undone.",
  okText = "Confirm",
  cancelText = "Cancel",
  okType = "primary",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okType={danger ? "danger" : okType}
      confirmLoading={loading}
      centered
      icon={
        <ExclamationCircleOutlined />
      }
      destroyOnHidden
    >
      <div
        style={{
          marginTop: 8,
        }}
      >
        {content}
      </div>
    </Modal>
  );
};

export default ConfirmModal;