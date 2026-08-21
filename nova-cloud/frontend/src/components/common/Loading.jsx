import React from "react";
import { Spin } from "antd";

const Loading = ({
  fullScreen = false,
  size = "large",
  tip = "Loading...",
}) => {
  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size={size} tip={tip} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loading;