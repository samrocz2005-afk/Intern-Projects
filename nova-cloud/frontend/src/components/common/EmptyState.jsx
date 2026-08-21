import React from "react";

import {
  Empty,
  Button,
} from "antd";

import {
  PlusOutlined,
} from "@ant-design/icons";

const EmptyState = ({
  description = "No data found.",
  buttonText,
  onAction,
  image = Empty.PRESENTED_IMAGE_SIMPLE,
}) => {
  return (
    <Empty
      image={image}
      description={description}
    >
      {buttonText &&
        onAction && (
          <Button
            type="primary"
            icon={
              <PlusOutlined />
            }
            onClick={onAction}
          >
            {buttonText}
          </Button>
        )}
    </Empty>
  );
};

export default EmptyState;