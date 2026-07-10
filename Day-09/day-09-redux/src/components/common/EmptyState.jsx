import React from "react";
import { Empty, Button } from "antd";

function EmptyState({
  description = "No Data Found",
  buttonText,
  onButtonClick,
}) {
  return (
    <Empty description={description}>
      {buttonText && (
        <Button
          type="primary"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </Empty>
  );
}

export default EmptyState;