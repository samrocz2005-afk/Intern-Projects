import { Grid, Layout } from "antd";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Sidebar from "../components/Layout/Sidebar";
import MobileSidebar from "../components/Layout/MobileSidebar";
import Header from "../components/Layout/Header";

import Board from "../components/Board/Board";

import AddTaskModal from "../components/Task/AddTaskModal";
import TaskDetailsModal from "../components/Task/TaskDetailsModal";

import AddBoardModal from "../components/BoardModal/AddBoardModal";
import EditBoardModal from "../components/BoardModal/EditBoardModal";
import DeleteBoardModal from "../components/BoardModal/DeleteBoardModal";
import EditTaskModal from "../components/Task/EditTaskModal";
import useUIStore from "../zustand/uiStore";

import {
  addBoard,
  updateBoard,
  setCurrentBoard,
  addTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
  toggleSubtask,
} from "../redux/slices/boardSlice";

const { Content } = Layout;
const { useBreakpoint } = Grid;

function Dashboard() {
  const screens = useBreakpoint();
  const dispatch = useDispatch();

  const {
    sidebarCollapsed,
    setSidebarCollapsed,

    mobileSidebar,
    setMobileSidebar,

    darkMode,
    toggleTheme,

    showAddTask,
    setShowAddTask,

    showAddBoard,
    setShowAddBoard,

    showEditBoard,
    setShowEditBoard,

    showDeleteBoard,
    setShowDeleteBoard,

    selectedTask,
    setSelectedTask,
  } = useUIStore();

  const boards = useSelector((state) => state.board.boards);
  const [showEditTask, setShowEditTask] = useState(false);

  const currentBoard = useSelector(
    (state) => state.board.currentBoard
  );

  const board =
    boards.find((b) => b.id === currentBoard) ||
    boards[0] ||
    null;

  useEffect(() => {
    if (!currentBoard && boards.length) {
      dispatch(setCurrentBoard(boards[0].id));
    }
  }, [boards, currentBoard, dispatch]);

  const handleBoardChange = useCallback(
    (id) => {
      dispatch(setCurrentBoard(id));
    },
    [dispatch]
  );

  const handleAddBoard = useCallback(
    (newBoard) => {
      dispatch(addBoard(newBoard));
      setShowAddBoard(false);
    },
    [dispatch, setShowAddBoard]
  );

  const handleUpdateBoard = useCallback(
    (updatedBoard) => {
      dispatch(updateBoard(updatedBoard));
      setShowEditBoard(false);
    },
    [dispatch, setShowEditBoard]
  );

  const handleAddTask = useCallback(
    (task) => {
      if (!board) return;

      dispatch(
        addTask({
          boardId: board.id,
          task,
        })
      );

      setShowAddTask(false);
    },
    [board, dispatch, setShowAddTask]
  );

  const handleStatusChange = useCallback(
    (taskId, status) => {
      if (!board) return;

      dispatch(
        changeTaskStatus({
          boardId: board.id,
          taskId,
          status,
        })
      );
    },
    [board, dispatch]
  );

  const handleToggleSubtask = useCallback(
    (taskId, subtaskId) => {
      if (!board) return;

      dispatch(
        toggleSubtask({
          boardId: board.id,
          taskId,
          subtaskId,
        })
      );
    },
    [board, dispatch]
  );
  const handleDeleteTask = useCallback(() => {
    if (!board || !selectedTask) return;

    dispatch(
        deleteTask({
        boardId: board.id,
        taskId: selectedTask.id,
        })
    );

    setSelectedTask(null);
    }, [
    board,
    selectedTask,
    dispatch,
    setSelectedTask,
    ]);

    const handleUpdateTask = useCallback(
        (updatedTask) => {
            if (!board) return;

            dispatch(
            updateTask({
                boardId: board.id,
                task: updatedTask,
            })
            );

            setSelectedTask(updatedTask);
            setShowEditTask(false);
        },
        [board, dispatch, setSelectedTask]
        );

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "#20212C"
          : "#F4F7FD",
      }}
    >
      {screens.md ? (
        <Sidebar
          collapsed={sidebarCollapsed}
          boards={boards}
          currentBoard={currentBoard}
          darkMode={darkMode}
          onThemeChange={toggleTheme}
          onToggleSidebar={() =>
            setSidebarCollapsed(!sidebarCollapsed)
          }
          onBoardChange={handleBoardChange}
          onCreateBoard={() =>
            setShowAddBoard(true)
          }
        />
      ) : (
        <MobileSidebar
          open={mobileSidebar}
          onClose={() =>
            setMobileSidebar(false)
          }
          boards={boards}
          currentBoard={currentBoard}
          darkMode={darkMode}
          onThemeChange={toggleTheme}
          onBoardChange={(id) => {
            handleBoardChange(id);
            setMobileSidebar(false);
          }}
          onCreateBoard={() =>
            setShowAddBoard(true)
          }
        />
      )}

      <Layout>
        <Header
          boardName={board?.name}
          onAddTask={() =>
            setShowAddTask(true)
          }
          onEditBoard={() =>
            setShowEditBoard(true)
          }
          onDeleteBoard={() =>
            setShowDeleteBoard(true)
          }
        />

        <Content
          style={{
            background: darkMode
              ? "#20212C"
              : "#F4F7FD",
            overflow: "auto",
          }}
        >
          <Board
            board={board}
            columns={board?.columns || []}
            onTaskClick={setSelectedTask}
            onDropTask={handleStatusChange}
          />
        </Content>
      </Layout>

      <AddTaskModal
        open={showAddTask}
        columns={board?.columns || []}
        onCancel={() =>
          setShowAddTask(false)
        }
        onSubmit={handleAddTask}
      />

      <TaskDetailsModal
        open={!!selectedTask}
        task={selectedTask}
        columns={board?.columns || []}
        onClose={() => setSelectedTask(null)}
        onEdit={() => setShowEditTask(true)}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        onSubtaskToggle={handleToggleSubtask}
        />

        <EditTaskModal
        open={showEditTask}
        task={selectedTask}
        columns={board?.columns || []}
        onCancel={() => setShowEditTask(false)}
        onSubmit={handleUpdateTask}
        />

      <AddBoardModal
        open={showAddBoard}
        onCancel={() =>
          setShowAddBoard(false)
        }
        onSubmit={handleAddBoard}
      />

      <EditBoardModal
        open={showEditBoard}
        board={board}
        onCancel={() =>
          setShowEditBoard(false)
        }
        onSubmit={handleUpdateBoard}
      />

      <DeleteBoardModal
        open={showDeleteBoard}
        board={board}
        onCancel={() => setShowDeleteBoard(false)}
        />
    </Layout>
  );
}

export default Dashboard;