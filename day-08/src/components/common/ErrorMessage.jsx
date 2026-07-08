import { Alert } from "antd";

function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Alert
      message="Error"
      description={message}
      type="error"
      showIcon
      style={{ marginBottom: "20px" }}
    />
  );
}

export default ErrorMessage;