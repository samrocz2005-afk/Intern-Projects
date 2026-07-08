import { useEffect, useState } from "react";
import { Typography } from "antd";

import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getTasks } from "../services/api";

const { Title } = Typography;

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((previousTasks) => [...previousTasks, newTask]);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Title level={2}>Task Manager</Title>

      <ErrorMessage message={error} />

      <TaskForm onTaskAdded={handleTaskAdded} />

      <TaskList tasks={tasks} />
    </div>
  );
}

export default Tasks;