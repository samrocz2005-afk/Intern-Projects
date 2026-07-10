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
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    />
  );
}

export default ErrorMessage;