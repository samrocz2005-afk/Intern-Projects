import { Spin } from "antd";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
}

export default Loader;