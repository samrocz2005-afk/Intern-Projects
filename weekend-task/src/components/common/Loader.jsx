import { Spin } from "antd";

function Loader({
  fullScreen = false,
  text = "Loading...",
  height = "100%",
}) {
  return (
    <div
      style={{
        height: fullScreen ? "100vh" : height,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: fullScreen ? "#20212C" : "transparent",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Spin size="large" />

        <p
          style={{
            color: "#828FA3",
            marginTop: 16,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default Loader;