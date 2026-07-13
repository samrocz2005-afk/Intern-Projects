import { useMemo, useState } from "react";

function useBoards(initialBoards = []) {
  const [boards, setBoards] = useState(initialBoards);

  const [currentBoardId, setCurrentBoardId] =
    useState(initialBoards[0]?.id || "");

  const currentBoard = useMemo(() => {
    return boards.find(
      (board) => board.id === currentBoardId
    );
  }, [boards, currentBoardId]);

  const selectBoard = (id) => {
    setCurrentBoardId(id);
  };

  const addBoard = (board) => {
    setBoards((prev) => [...prev, board]);
  };

  const updateBoard = (updatedBoard) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === updatedBoard.id
          ? updatedBoard
          : board
      )
    );
  };

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter(
      (board) => board.id !== boardId
    );

    setBoards(updatedBoards);

    if (updatedBoards.length) {
      setCurrentBoardId(updatedBoards[0].id);
    } else {
      setCurrentBoardId("");
    }
  };

  return {
    boards,
    setBoards,

    currentBoard,

    currentBoardId,

    selectBoard,

    addBoard,

    updateBoard,

    deleteBoard,
  };
}

export default useBoards;