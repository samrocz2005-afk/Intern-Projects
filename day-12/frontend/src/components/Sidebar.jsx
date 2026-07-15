import { Layout, Menu } from "antd";
import {
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ selectedKey, onMenuClick }) => {
  const items = [
    {
      key: "students",
      icon: <TeamOutlined />,
      label: "Students",
    },
    {
      key: "books",
      icon: <BookOutlined />,
      label: "Books",
    },
  ];

  return (
    <Sider
      width={220}
      style={{
        minHeight: "100vh",
        background: "#001529",
      }}
    >
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "20px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        📚 Library
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={({ key }) => onMenuClick(key)}
      />
    </Sider>
  );
};

export default Sidebar;