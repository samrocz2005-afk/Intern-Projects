import React, { useEffect } from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { fetchTasks } from "../features/tasks/taskSlice";

import {
  selectTasks,
  selectCompletedTasks,
  selectPendingTasks,
} from "../features/tasks/taskSelectors";

import {
  selectCurrentUser,
} from "../features/auth/authSelectors";

const { Title } = Typography;

function Dashboard() {
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);

  const tasks = useSelector(selectTasks);

  const completedTasks = useSelector(
    selectCompletedTasks
  );

  const pendingTasks = useSelector(
    selectPendingTasks
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <>
      <Title level={2}>
        Welcome, {user?.name}
      </Title>

      <Row gutter={20}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={tasks.length}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Completed"
              value={completedTasks.length}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Pending"
              value={pendingTasks.length}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Recent Tasks"
        style={{ marginTop: 30 }}
      >
        {tasks.slice(0).map((task) => (
          <p key={task.id}>
            • {task.title}
          </p>
        ))}
      </Card>
    </>
  );
}

export default Dashboard;