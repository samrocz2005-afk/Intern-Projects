import React from "react";

function ErrorMessage({ message }) {
  return (
    <div className="error-container">
      <p>{message}</p>
    </div>
  );
}

ErrorMessage.defaultProps = {
  message: "Something went wrong. Please try again.",
};

export default ErrorMessage;