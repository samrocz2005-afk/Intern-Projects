import React from "react";
import {
  Alert,
  Button,
  Space,
} from "antd";

import {
  ReloadOutlined,
} from "@ant-design/icons";

const ErrorMessage = ({
  message = "Something went wrong.",
  title = "Error",
  onRetry,
  showRetry = true,
}) => {
  return (
    <Alert
      type="error"
      showIcon
      message={title}
      description={
        <Space
          direction="vertical"
          size={8}
        >
          <span>{message}</span>

          {showRetry &&
            onRetry && (
              <Button
                size="small"
                icon={
                  <ReloadOutlined />
                }
                onClick={onRetry}
              >
                Try Again
              </Button>
            )}
        </Space>
      }
    />
  );
};

export default ErrorMessage;