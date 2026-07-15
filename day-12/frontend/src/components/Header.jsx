import { Layout, Typography } from "antd";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = ({ title }) => {
  return (
    <AntHeader
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Title
        level={3}
        style={{
          margin: 0,
        }}
      >
        {title}
      </Title>
    </AntHeader>
  );
};

export default Header;