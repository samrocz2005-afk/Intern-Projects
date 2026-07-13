import {
  Layout,
  Menu,
  Typography,
  Button,
  Switch,
  Space,
} from "antd";

import {
  DashboardOutlined,
  TableChartOutlined,
  VisibilityOffOutlined,
  LightModeOutlined,
  DarkModeOutlined,
  AddOutlined,
} from "@mui/icons-material";

const { Sider } = Layout;
const { Title, Text } = Typography;

function Sidebar({
  collapsed,
  boards,
  currentBoard,
  onBoardChange,
  onToggleSidebar,
  darkMode,
  onThemeChange,
  onCreateBoard,
}) {
  const bgColor = darkMode ? "#2B2C37" : "#FFFFFF";
  const textColor = darkMode ? "#FFFFFF" : "#000112";
  const panelColor = darkMode ? "#20212C" : "#F4F7FD";

  const menuItems = boards.map((board) => ({
    key: board.id,
    icon: <TableChartOutlined />,
    label: board.name,
  }));

  return (
    <Sider
      width={300}
      collapsedWidth={0}
      collapsed={collapsed}
      style={{
        background: bgColor,
        height: "100vh",
        borderRight: darkMode
          ? "1px solid #3E3F4E"
          : "1px solid #E4EBFA",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <DashboardOutlined
          style={{
            fontSize: 32,
            color: "#635FC7",
          }}
        />

        <Title
          level={2}
          style={{
            color: textColor,
            margin: 0,
          }}
        >
          kanban
        </Title>
      </div>

      {/* Boards Count */}
      <Text
        style={{
          color: "#828FA3",
          paddingLeft: 24,
          display: "block",
          letterSpacing: 2,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        ALL BOARDS ({boards.length})
      </Text>

      {/* Boards */}
      <Menu
        mode="inline"
        selectedKeys={[String(currentBoard)]}
        items={menuItems}
        onClick={({ key }) => onBoardChange(key)}
        style={{
          background: bgColor,
          border: "none",
        }}
      />

      {/* Create Board */}
      <Button
        type="text"
        block
        icon={<AddOutlined />}
        onClick={onCreateBoard}
        style={{
          color: "#635FC7",
          textAlign: "left",
          marginTop: 12,
          height: 48,
          fontWeight: 700,
          paddingLeft: 24,
        }}
      >
        Create New Board
      </Button>

      {/* Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          padding: "0 24px",
        }}
      >
        {/* Theme */}
        <div
          style={{
            background: panelColor,
            borderRadius: 10,
            padding: 14,
            marginBottom: 18,
          }}
        >
          <Space
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            <LightModeOutlined
              style={{
                color: "#828FA3",
              }}
            />

            <Switch
              checked={darkMode}
              onChange={onThemeChange}
            />

            <DarkModeOutlined
              style={{
                color: "#828FA3",
              }}
            />
          </Space>
        </div>

        {/* Hide Sidebar */}
        <Button
          type="text"
          icon={<VisibilityOffOutlined />}
          block
          onClick={onToggleSidebar}
          style={{
            color: "#828FA3",
            textAlign: "left",
            height: 48,
            fontWeight: 700,
          }}
        >
          Hide Sidebar
        </Button>
      </div>
    </Sider>
  );
}

export default Sidebar;