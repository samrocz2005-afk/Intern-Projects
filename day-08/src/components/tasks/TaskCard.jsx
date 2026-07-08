import { Card, Typography } from "antd";
import { Chip, Stack } from "@mui/material";

const { Title, Text } = Typography;

function TaskCard({ task }) {
  const getChipColor = () => {
    switch (task.priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card className="task-card">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>
          <Title level={5} style={{ marginBottom: 5 }}>
            {task.title}
          </Title>

          <Text type="secondary">
            Task ID: {task.id}
          </Text>
        </div>

        <Chip
          label={task.priority}
          color={getChipColor()}
          variant="filled"
        />
      </Stack>
    </Card>
  );
}

export default TaskCard;