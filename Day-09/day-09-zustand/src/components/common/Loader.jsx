import React from "react";
import { Spin, Flex } from "antd";

function Loader({ tip = "Loading..." }) {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "300px",
      }}
    >
      <Spin
        size="large"
        tip={tip}
      />
    </Flex>
  );
}

export default Loader;