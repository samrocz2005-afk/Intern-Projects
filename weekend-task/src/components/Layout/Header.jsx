import {
  Layout,
  Typography,
  Button,
  Dropdown,
  Grid,
} from "antd";

import {
  Add,
  MoreVert,
  Menu,
  Edit,
  Delete,
} from "@mui/icons-material";

const { Header: AntHeader } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

function Header({
  boardName,
  onAddTask,
  onEditBoard,
  onDeleteBoard,
  onMenuClick,
}) {
  const screens = useBreakpoint();

  const hasBoard = Boolean(boardName);

  const menuItems = [
    {
      key: "edit",
      icon: <Edit fontSize="small" />,
      label: "Edit Board",
      disabled: !hasBoard,
    },
    {
      key: "delete",
      icon: <Delete fontSize="small" />,
      label: "Delete Board",
      danger: true,
      disabled: !hasBoard,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "edit") {
      onEditBoard?.();
    }

    if (key === "delete") {
      onDeleteBoard?.();
    }
  };

  return (
    <AntHeader
      style={{
        height: 96,
        padding: "0 24px",
        background: "#2B2C37",
        borderBottom: "1px solid #3E3F4E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {!screens.md && (
          <Button
            type="text"
            icon={
              <Menu
                style={{
                  color: "#FFFFFF",
                }}
              />
            }
            onClick={onMenuClick}
          />
        )}

        <Title
          level={screens.md ? 2 : 3}
          style={{
            margin: 0,
            color: "#FFFFFF",
          }}
        >
          {boardName || "No Board"}
        </Title>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Button
          type="primary"
          icon={<Add />}
          size="large"
          disabled={!hasBoard}
          onClick={onAddTask}
          style={{
            background: "#635FC7",
            borderColor: "#635FC7",
            borderRadius: 24,
            height: 48,
            paddingInline: screens.md ? 24 : 14,
            fontWeight: 700,
          }}
        >
          {screens.md ? "Add New Task" : null}
        </Button>

        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: menuItems,
            onClick: handleMenuClick,
          }}
        >
          <Button
            type="text"
            icon={
              <MoreVert
                style={{
                  color: "#828FA3",
                  fontSize: 28,
                }}
              />
            }
          />
        </Dropdown>
      </div>
    </AntHeader>
  );
}

export default Header;