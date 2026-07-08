import { Card } from "antd";
import { Chip, Stack } from "@mui/material";

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p>No Tasks Found</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <Card
          key={task.id}
          style={{ marginBottom: 15 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <h3>{task.title}</h3>

            <Chip
              label={task.priority}
              color={
                task.priority === "High"
                  ? "error"
                  : task.priority === "Medium"
                  ? "warning"
                  : "success"
              }
            />
          </Stack>
        </Card>
      ))}
    </div>
  );
}

export default TaskList;