import {
  Drawer,
  Menu,
  Typography,
  Button,
  Switch,
  Space,
} from "antd";

import {
  DashboardOutlined,
  TableOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

import {
  LightModeOutlined,
  DarkModeOutlined,
} from "@mui/icons-material";

const { Title, Text } = Typography;

function MobileSidebar({
  open,
  onClose,
  boards = [],
  currentBoard,
  onBoardChange,
  darkMode,
  onThemeChange,
  onCreateBoard,
}) {
  const bgColor = darkMode ? "#2B2C37" : "#FFFFFF";
  const panelColor = darkMode ? "#20212C" : "#F4F7FD";
  const textColor = darkMode ? "#FFFFFF" : "#000112";

  const menuItems = boards.map((board) => ({
    key: String(board.id),
    icon: <TableOutlined />,
    label: board.name,
  }));

  const handleBoardClick = ({ key }) => {
    onBoardChange?.(key);
    onClose?.();
  };

  const handleCreateBoard = () => {
    onClose?.();
    onCreateBoard?.();
  };

  return (
    <Drawer
      open={open}
      placement="left"
      width={280}
      closable={false}
      destroyOnClose
      onClose={onClose}
      styles={{
        body: {
          padding: 0,
          background: bgColor,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 24,
        }}
      >
        <DashboardOutlined
          style={{
            color: "#635FC7",
            fontSize: 30,
          }}
        />

        <Title
          level={2}
          style={{
            margin: 0,
            color: textColor,
          }}
        >
          kanban
        </Title>
      </div>

      {/* Board Count */}
      <Text
        style={{
          color: "#828FA3",
          paddingLeft: 24,
          marginBottom: 18,
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        ALL BOARDS ({boards.length})
      </Text>

      {/* Boards */}
      <Menu
        mode="inline"
        selectedKeys={[String(currentBoard)]}
        items={menuItems}
        onClick={handleBoardClick}
        style={{
          background: bgColor,
          border: "none",
        }}
      />

      {/* Create Board */}
      <Button
        type="text"
        block
        onClick={handleCreateBoard}
        style={{
          color: "#635FC7",
          textAlign: "left",
          paddingLeft: 24,
          marginTop: 12,
          height: 48,
          fontWeight: 700,
        }}
      >
        + Create New Board
      </Button>

      <div style={{ flex: 1 }} />

      {/* Theme */}
      <div
        style={{
          margin: 24,
          background: panelColor,
          borderRadius: 8,
          padding: 16,
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
        icon={<EyeInvisibleOutlined />}
        onClick={onClose}
        style={{
          margin: "0 12px 24px",
          height: 48,
          color: "#828FA3",
          textAlign: "left",
          fontWeight: 700,
        }}
      >
        Hide Sidebar
      </Button>
    </Drawer>
  );
}

export default MobileSidebar;