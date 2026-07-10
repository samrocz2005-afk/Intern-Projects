import { Flex, Spin } from "antd";

function Loader() {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "300px",
      }}
    >
      <Spin size="large" tip="Loading..." />
    </Flex>
  );
}

export default Loader;