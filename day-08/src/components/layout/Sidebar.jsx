import { Layout, Menu, Typography, Button } from "antd";
import {
  CheckSquareOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Sider width={220}>
      <div
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Title level={4} style={{ color: "white", margin: 0 }}>
          Task Manager
        </Title>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={[
          {
            key: "/dashboard/tasks",
            icon: <CheckSquareOutlined />,
            label: (
              <NavLink to="/dashboard/tasks">
                Tasks
              </NavLink>
            ),
          },
          {
            key: "/dashboard/profile",
            icon: <UserOutlined />,
            label: (
              <NavLink to="/dashboard/profile">
                Profile
              </NavLink>
            ),
          },
        ]}
      />

      <div
        style={{
          padding: "20px",
        }}
      >
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          block
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}

export default Sidebar;