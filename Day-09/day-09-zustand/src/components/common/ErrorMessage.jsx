import React from "react";
import { Alert } from "antd";

function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Alert
      type="error"
      showIcon
      message="Error"
      description={message}
      style={{
        marginBottom: 20,
      }}
    />
  );
}

export default ErrorMessage;