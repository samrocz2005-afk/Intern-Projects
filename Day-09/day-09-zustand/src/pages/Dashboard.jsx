import React, { useEffect, useMemo, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  List,
  Tag,
} from "antd";

import useAuth from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";

const { Title, Text } = Typography;

function Dashboard() {
  const { user } = useAuth();
  const {
    tasks = [], // Fallback to an empty array to prevent undefined crashes
    loading,
    loadTasks,
  } = useTasks();

  // Keep track of the last loaded user ID to prevent duplicate fetch calls
  const lastFetchedUserId = useRef(null);

  useEffect(() => {
    if (user?.id && lastFetchedUserId.current !== user.id) {
      lastFetchedUserId.current = user.id; // Block immediate duplicate renders
      loadTasks(user.id);
    }
  }, [user?.id, loadTasks]);

  // Safely calculate status combinations using optional chaining fallbacks
  const completedTasks = useMemo(
    () => (tasks || []).filter((task) => task?.status === "Completed"),
    [tasks]
  );

  const pendingTasks = useMemo(
    () => (tasks || []).filter((task) => task?.status !== "Completed"),
    [tasks]
  );

  return (
    <>
      <Title level={2}>
        Welcome, {user?.name || "User"}
      </Title>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Tasks"
              value={(tasks || []).length}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic
              title="Completed"
              value={completedTasks.length}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic
              title="Pending"
              value={pendingTasks.length}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Recent Tasks"
        loading={loading}
        style={{ marginTop: 24 }}
      >
        {(tasks || []).length === 0 ? (
          <Text type="secondary">
            No tasks available.
          </Text>
        ) : (
          <List
            dataSource={(tasks || []).slice(0, 5)}
            renderItem={(task) => (
              <List.Item>
                <List.Item.Meta
                  title={task?.title}
                  description={task?.description}
                />

                <Tag
                  color={
                    task?.status === "Completed"
                      ? "green"
                      : task?.status === "In Progress"
                      ? "blue"
                      : "orange"
                  }
                >
                  {task?.status || "Pending"}
                </Tag>
              </List.Item>
            )}
          />
        )}
      </Card>
    </>
  );
}

export default Dashboard;