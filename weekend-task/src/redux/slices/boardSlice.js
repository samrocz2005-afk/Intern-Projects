import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "kanban_boards";
const CURRENT_BOARD_KEY = "kanban_current_board";

const loadBoards = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveBoards = (boards) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(boards)
  );
};

const boards = loadBoards();

const initialState = {
  boards,
  currentBoard:
    localStorage.getItem(CURRENT_BOARD_KEY) ||
    boards[0]?.id ||
    null,
};

const boardSlice = createSlice({
  name: "board",

  initialState,

  reducers: {
    // =====================================
    // Boards
    // =====================================

    setBoards(state, action) {
      state.boards = action.payload;

      if (
        !state.boards.some(
          (board) => board.id === state.currentBoard
        )
      ) {
        state.currentBoard =
          state.boards[0]?.id || null;

        if (state.currentBoard) {
          localStorage.setItem(
            CURRENT_BOARD_KEY,
            state.currentBoard
          );
        }
      }

      saveBoards(state.boards);
    },

    setCurrentBoard(state, action) {
      state.currentBoard = action.payload;

      localStorage.setItem(
        CURRENT_BOARD_KEY,
        action.payload
      );
    },

    addBoard(state, action) {
      const board = {
        ...action.payload,
        columns: (action.payload.columns || []).map(
          (column) => ({
            ...column,
            tasks: column.tasks || [],
          })
        ),
      };

      state.boards.push(board);

      state.currentBoard = board.id;

      localStorage.setItem(
        CURRENT_BOARD_KEY,
        board.id
      );

      saveBoards(state.boards);
    },

    updateBoard(state, action) {
      const board = state.boards.find(
        (b) => b.id === action.payload.id
      );

      if (!board) return;

      board.name = action.payload.name;

      board.columns = action.payload.columns.map(
        (updatedColumn) => {
          const existingColumn = board.columns.find(
            (column) =>
              column.id === updatedColumn.id
          );

          return {
            ...updatedColumn,
            tasks: existingColumn?.tasks || [],
          };
        }
      );

      saveBoards(state.boards);
    },

    deleteBoard(state, action) {
      state.boards = state.boards.filter(
        (board) => board.id !== action.payload
      );

      if (state.currentBoard === action.payload) {
        state.currentBoard =
          state.boards[0]?.id || null;

        if (state.currentBoard) {
          localStorage.setItem(
            CURRENT_BOARD_KEY,
            state.currentBoard
          );
        } else {
          localStorage.removeItem(
            CURRENT_BOARD_KEY
          );
        }
      }

      saveBoards(state.boards);
    },

    // =====================================
    // Columns
    // =====================================

    addColumn(state, action) {
      const { boardId, column } = action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      board.columns.push({
        ...column,
        tasks: column.tasks || [],
      });

      saveBoards(state.boards);
    },

    updateColumn(state, action) {
      const {
        boardId,
        columnId,
        updatedColumn,
      } = action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      const column = board.columns.find(
        (c) => c.id === columnId
      );

      if (!column) return;

      column.name = updatedColumn.name;
      column.color = updatedColumn.color;

      saveBoards(state.boards);
    },

    deleteColumn(state, action) {
      const { boardId, columnId } =
        action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      board.columns = board.columns.filter(
        (column) => column.id !== columnId
      );

      saveBoards(state.boards);
    },

    // =====================================
    // Tasks
    // =====================================

    addTask(state, action) {
      const { boardId, task } =
        action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      const column = board.columns.find(
        (c) => c.id === task.status
      );

      if (!column) return;

      if (!column.tasks) {
        column.tasks = [];
      }

      column.tasks.push(task);

      saveBoards(state.boards);
    },

    updateTask(state, action) {
      const { boardId, task } =
        action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      board.columns.forEach((column) => {
        column.tasks = column.tasks.filter(
          (t) => t.id !== task.id
        );
      });

      const destination = board.columns.find(
        (c) => c.id === task.status
      );

      if (!destination) return;

      destination.tasks.push(task);

      saveBoards(state.boards);
    },

    deleteTask(state, action) {
      const { boardId, taskId } =
        action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      board.columns.forEach((column) => {
        column.tasks = column.tasks.filter(
          (task) => task.id !== taskId
        );
      });

      saveBoards(state.boards);
    },

    moveTask(state, action) {
      const {
        boardId,
        taskId,
        destinationColumnId,
      } = action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      let movedTask = null;

      board.columns.forEach((column) => {
        const index = column.tasks.findIndex(
          (task) => task.id === taskId
        );

        if (index !== -1) {
          movedTask = {
            ...column.tasks[index],
            status: destinationColumnId,
          };

          column.tasks.splice(index, 1);
        }
      });

      if (!movedTask) return;

      const destination = board.columns.find(
        (c) => c.id === destinationColumnId
      );

      if (!destination) return;

      destination.tasks.push(movedTask);

      saveBoards(state.boards);
    },

    toggleSubtask(state, action) {
      const {
        boardId,
        taskId,
        subtaskId,
      } = action.payload;

      const board = state.boards.find(
        (b) => b.id === boardId
      );

      if (!board) return;

      board.columns.forEach((column) => {
        column.tasks.forEach((task) => {
          if (task.id === taskId) {
            const subtask =
              task.subtasks?.find(
                (s) => s.id === subtaskId
              );

            if (subtask) {
              subtask.done = !subtask.done;
            }
          }
        });
      });

      saveBoards(state.boards);
    },

    changeTaskStatus(state, action) {
      boardSlice.caseReducers.moveTask(state, {
        payload: {
          boardId: action.payload.boardId,
          taskId: action.payload.taskId,
          destinationColumnId:
            action.payload.status,
        },
      });
    },
  },
});

export const {
  setBoards,
  setCurrentBoard,
  addBoard,
  updateBoard,
  deleteBoard,
  addColumn,
  updateColumn,
  deleteColumn,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  toggleSubtask,
  changeTaskStatus,
} = boardSlice.actions;

export default boardSlice.reducer;